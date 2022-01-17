import { WebSocketServer, Server, WebSocket, RawData } from 'ws';
import { BrowserWindow } from 'electron';
import detectPort from 'detect-port';

// Library
import getLocalIP, { INetwork } from '@lib/network/getLocalIP';

// Constants
import { ExportServerChannels } from '@utils/channels';
import AccurateTimer from '@electron/helpers/accurateTimer';
import DummyData from '../DummyData';

// Store
import GlobalStore from '../../../lib/globalStore/GlobalStore';

// Protocols
import V1 from './protocols/v1';

export interface IInterface {
  ip: string | undefined;
  ipFamily: string | undefined;
  port: number | undefined;
  name: string;
}

export interface IServerStatus {
  clients: number | undefined;
  protocols: IProtocol[] | null;
  currentProtocol: IProtocol | string;
  status: string;
  isStreamingData: 'streaming' | 'paused' | 'continued' | null;
}

export interface IServerInfo {
  ip: INetwork[] | null;
  port: number | null;
  version: string;
}

export interface IClientStatus extends IInterface {
  state: number;
  url: undefined | string;
  appName: string | undefined;
  status?: string | undefined;
}

export interface IWebSocket extends WebSocket, IInterface {
  id: string;
  appName: string | undefined;
  status?: string | undefined;
}

export interface IProtocol {
  name: string;
  outputDataSize: string;
  samplingRate: number;
  parameters: string[];
  protocolVersion: string;
  payloadType: string;
}

export type Commands = 'start' | 'pause' | 'stop' | 'get-protocol-version';

export type IDataSize = {
  label: string;
  value: 'batch' | 'sdp';
};

export type IDataTypes = {
  label: string;
  value: 'JSON' | 'string';
};

export const dataSize: IDataSize[] = [
  { label: 'Batch (25samples)', value: 'batch' },
  { label: 'Single Data Point', value: 'sdp' },
];

export const dataTypes: IDataTypes[] = [
  { label: 'JSON', value: 'JSON' },
  { label: 'String', value: 'string' },
];

export const sendTo = [{ label: 'All Clients', value: 'all' }];
// Define protocols

class ExportServer {
  #securityPhrase: 'beastspectrum-export-stream+'; // Private
  mainWindow: Electron.BrowserWindow | undefined;
  ip: INetwork[] | null;
  port: number | null;
  server: Server | null;
  sockets: IWebSocket[];
  readySockets: IWebSocket[];
  isListening: boolean;
  isStreamingData: IServerStatus['isStreamingData'];
  protocols: IProtocol[];
  currentProtocol: IProtocol | null;
  nextId: number;
  curDataPointIndex: number;
  batchSize: number;
  dummyData: DummyData;
  data: any;

  constructor() {
    this.#securityPhrase = 'beastspectrum-export-stream+';
    this.mainWindow = BrowserWindow.getAllWindows()[0];

    // Server Info
    this.ip = null;
    this.port = null;
    this.server = null;
    this.sockets = [];
    this.readySockets = [];
    this.protocols = [V1];
    this.currentProtocol = null;
    this.isListening = false;
    this.isStreamingData = null;

    this.nextId = 0; // Used for setting sockets' Id
    this.curDataPointIndex = 0; // Used for saving the last data point index on pause
    this.batchSize = 25;

    // Sample data
    this.dummyData = new DummyData('30min');
    this.data = null;
    setTimeout(
      async () => (this.data = await this.dummyData.getDummyDataFromDb()),
      250
    );
  }

  /* ------------ GETTERS ------------ */
  /**
   * Gets the current server status
   */
  public get serverStatus(): IServerStatus {
    return {
      clients: this.sockets.length,
      protocols: this.protocols,
      currentProtocol: this.currentProtocol?.name || 'No protocol selected',
      status: this.isListening ? 'Active' : 'Error',
      isStreamingData: this.isStreamingData,
    };
  }

  /**
   * Returns the current server information as an object.
   */
  public get serverInfo(): IServerInfo {
    return {
      ip: this.ip,
      port: this.port,
      version: '0.1.0 - Alpha',
    };
  }

  public get clientsStatus(): IClientStatus[] {
    const clients: IClientStatus[] = [];
    this.sockets?.forEach((socket) => {
      clients.push({
        url: socket.url,
        state: socket.readyState,
        status: socket.status,
        ip: socket.ip,
        ipFamily: socket.ipFamily,
        port: socket.port,
        name: socket.id,
        appName: socket.appName,
      });
    });
    return clients;
  }

  /* ------------ STREAMS ------------ */
  /**
   * Starts streaming of data
   */
  public startStream = () => {
    // Dont start another stream if one is active
    if (this.isStreamingData === 'streaming') {
      this.sendServerError(
        'error:The server is already streaming data. Cannot start another stream'
      );
      return;
    }

    const outputDataSize = GlobalStore.getExportServer(
      'outputDataSize'
    ) as string;

    const outputDataType = GlobalStore.getExportServer('outputDataType') as
      | 'JSON'
      | 'string';

    const sendTo = GlobalStore.getExportServer('sendTo') as
      | 'All Clients'
      | string;

    if (this.readySockets.length > 0) {
      this.sendCommand('start');
      this.isStreamingData = 'streaming';

      // Default to batch data
      let dataPointFormatter: (dataObj: any) => any =
        this.formatDataPointAsJSON;
      let formatDataFunc: (dataPointFormatter: (dataObj: any) => any) => any[] =
        this.formatBatchData;
      let sendFunc: (data: any[]) => void;

      if (sendTo === 'All Clients') {
        sendFunc = (data) =>
          this.readySockets.forEach((socket) =>
            socket.send(JSON.stringify(data))
          );
      } else {
        const selectedSocket = this.readySockets.find(
          (socket) => socket.appName === sendTo
        ) as IWebSocket;
        sendFunc = (data: any) => selectedSocket.send(JSON.stringify(data));
      }

      if (outputDataSize === 'batch') {
        this.batchSize = 25;
        formatDataFunc = this.formatBatchData;
      }

      if (outputDataSize === 'sdp') {
        this.batchSize = 1;
        formatDataFunc = this.formatSinglePointData;
      }

      if (outputDataSize === 'JSON') {
        dataPointFormatter = this.formatDataPointAsJSON;
      }

      if (outputDataType === 'string') {
        dataPointFormatter = this.formatDataPointAsString;
      }

      this.streamData(formatDataFunc, dataPointFormatter, sendFunc);
      this.updateStatus();
    }
  };

  /**
   * Stops streaming of data
   */
  public stopStream = () => {
    if (this.isStreamingData === null) {
      this.sendServerError('error:The are no active streams to stop.');
      return;
    }
    this.curDataPointIndex = 0;
    this.isStreamingData = null;
    this.sendCommand('stop');
    this.updateStatus();
  };

  /**
   * Pauses streaming of data
   */
  public pauseStream = () => {
    if (this.isStreamingData === null || this.isStreamingData === 'paused') {
      this.sendServerError('error:The are no active streams to pause.');
      return;
    }
    this.isStreamingData = 'paused';
    this.sendCommand('pause');
    this.updateStatus();
  };

  /**
   * Sends a command to all the connected sockets
   * @param command - The command/message string to be sent to the sockets
   */
  public sendCommand = (command: Commands) => {
    this.sockets.forEach((socket) => socket.send(command));
  };

  /**
   * Starts streaming a batch of data to the socket.
   */
  private streamData = async (
    formatData: (dataPointFormatter: (obj: any) => any) => any[],
    dataPointFormatter: (obj: any) => any,
    sendFunc: (data: any) => void
  ) => {
    const timer = new AccurateTimer(() => {
      // Check stream time to stop before any other code execution
      if (this.isStreamingData === null || this.isStreamingData === 'paused') {
        timer.stop();
        return;
      }

      // Since this loop executes one last time after the stop is called,
      // a check is done to make sure no extra data is sent to the sockets.
      // TODO: Fix this issue
      const batchData = formatData(dataPointFormatter);
      sendFunc(batchData);
    }, 10 * this.batchSize);
    timer.start();
  };

  /**
   * Formats the data in a batch
   */
  private formatBatchData = (dataPointFormatter: (dataObj: any) => any) => {
    const batchData = new Array(this.batchSize).fill(0);
    // Create the batch to be sent
    for (let j = 0; j < this.batchSize; j++) {
      batchData[j] = dataPointFormatter(this.data[this.curDataPointIndex]);
      this.curDataPointIndex += 1;
    }

    return batchData;
  };

  /**
   * Formats the data in a batch
   */
  private formatSinglePointData = (
    dataPointFormatter: (dataObj: any) => any
  ) => {
    const batchData = new Array(this.batchSize).fill(0);
    // Create the batch to be sent
    for (let j = 0; j < this.batchSize; j++) {
      batchData[j] = dataPointFormatter(this.data[this.curDataPointIndex]);
      this.curDataPointIndex += 1;
    }
    return batchData;
  };

  /**
   * Formats the data object to an array
   * @param dataObj - The data point object from the database
   * @returns - A data point array `[Timestamp, O2Hb, HHb, THb, TOI, ...]`
   */
  private formatDataPointAsJSON = (dataObj: any) => {
    return {
      timeStamp: dataObj.timeStamp,
      O2Hb: dataObj.O2Hb,
      HHb: dataObj.HHb,
      THb: dataObj.THb,
      TOI: dataObj.TOI,
      HbDiff: 0,
      PI: 0,
      SCORx: 0,
      SCPRx: 0,
    };
  };

  private formatDataPointAsString = (dataObj: any) => {
    return `[${dataObj.timeStamp},${dataObj.O2Hb},${dataObj.HHb},${
      dataObj.THb
    },${dataObj.TOI},${0},${0},${0},${0}]`;
  };

  /**
   * Starts the export websocket server
   */
  public start = async () => {
    this.server = await this.createServer();
    this.handleIncomingConnection();
    this.setLocalIP();
    this.addServerListeners();
  };

  /**
   * Stops the server and cleans up the memory
   */
  public stop = async () => {
    this.sockets.forEach((socket) => {
      socket.send('server:Shutting down');
      socket.close();
    });
    this.server?.close();

    //@ts-ignore
    setTimeout(() => (this.mainWindow = undefined), 100);
    this.sockets.length = 0;
    this.port = null;
    this.ip = null;
    console.log(GlobalStore.store.store);
  };

  /* ------------ STATE UPDATES ------------ */
  /**
   * Sets the server info state
   */
  public updateServerInfo = () => {
    console.log('Store Called1');
    GlobalStore.setExportServer('serverInfo', this.serverInfo);
  };

  /**
   * Sets the server status state
   */
  public updateStatus = () => {
    GlobalStore.setExportServer('serverStatus', this.serverStatus);
    GlobalStore.setExportServer('clientStatus', this.clientsStatus);
  };

  /**
   * Sends the server error message to the UI
   */
  public sendServerError = (message: string) => {
    this.sockets.forEach((socket) => socket.send(message.toString()));
    this.mainWindow?.webContents.send(
      ExportServerChannels.ServerError,
      message
    );
  };

  /* ------------ SOCKETS ------------ */

  /**
   * Handles the incoming websocket connection
   */
  private handleIncomingConnection = async () => {
    const secKey = 'security-phrase';

    this.server?.on('connection', (socket: IWebSocket, request) => {
      const isTrustable = request.headers[secKey] === this.#securityPhrase;
      const appName = request.headers['app-name'] as string | undefined;
      const protocolVersion = request.headers['protocol-version'] as
        | string
        | undefined;

      // Check if the request contains the security headers. If not refuse connection.
      if (!isTrustable) {
        socket.send('error:Security phrase was incorrect! Please try again.');
        request.destroy();
        socket?.terminate();
        return;
      }

      // Check if the total connections is not more than 3
      if (this.sockets.length >= 3) {
        socket.send(
          'error:Sever has reached the maximum number of active sockets.'
        );
        request.destroy();
        socket?.terminate();
        this.sendServerError(
          'Sever has reached the maximum number of active sockets!'
        );
        return;
      }

      // Add custom values to the socket object to keep track of them
      socket.id = `client:${++this.nextId}`;
      socket.appName = appName || socket.id;
      socket.ip = request.socket.remoteAddress;
      socket.ipFamily = request.socket.remoteFamily;
      socket.port = request.socket.remotePort;

      // Check for protocol version in the header
      switch (protocolVersion) {
        case 'v1':
          this.currentProtocol = V1;
          this.sendHeadersToSocket(socket);
          break;

        case undefined:
          this.handleNoHeaders(socket);
          break;

        default:
          this.sendServerError('error:Header not supported.');
          return;
      }

      // Keep track of each socket.
      this.sockets.push(socket as IWebSocket);
      this.addSocketListeners(socket);
    });
  };

  /**
   * Handles the connection of a socket that does not have the default headers
   * in the initial request.
   * @param socket - The socket connection
   */
  private handleNoHeaders = async (socket: IWebSocket) => {
    // Listen for commands
    socket.status = 'Waiting for protocol';
    this.updateStatus();

    // Listener function
    const listenForHeaderCommands = (data: RawData) => {
      switch (data.toString()) {
        case 'v1':
          this.currentProtocol = V1;
          socket.off('message', listenForHeaderCommands);
          this.sendHeadersToSocket(socket);
          this.updateStatus();
          return;

        default:
          this.sendServerError(
            'error:Protocol not found! Available protocols: "v1".'
          );
          break;
      }
    };

    // Ask for protocol version
    socket.send('get-protocol-version');

    // Remove the listener once the protocol has been selected
    socket.on('message', listenForHeaderCommands);
  };

  /**
   * Sends the selected protocol's header to the socket.
   * @param socket - The socket to send the headers to
   */
  private sendHeadersToSocket = (socket: IWebSocket) => {
    const dataType = GlobalStore.getExportServer('outputDataType');
    const dataSize = GlobalStore.getExportServer('outputDataSize');

    const headers = {
      samplingRate: 100,
      parameters: [
        'Time Stamp',
        'O2Hb',
        'HHb',
        'THb',
        'TOI',
        'Hbdiff',
        'PI',
        'SCORx',
        'SCPRx',
      ],
      protocolVersion: this.currentProtocol?.name,
      payloadType: dataType,
      dataSize: dataSize,
    };
    socket.send(JSON.stringify(headers));

    socket.status = 'Waiting for confirmation';
    this.updateStatus();

    const listenForConfirmation = (data: RawData) => {
      switch (data.toString()) {
        case 'headers-ok':
          socket.off('message', listenForConfirmation);
          socket.status = 'Open';
          this.readySockets.push(socket);
          this.handleSocketMessage(socket);
          this.updateStatus();
          return;

        default:
          this.sendServerError(
            'error:Command not supported! Waiting for headers confirmation "headers-ok".'
          );
          break;
      }
    };

    socket.on('message', listenForConfirmation);
  };

  /**
   * Handles the messaging of each web socket
   * @param socket - The web socket
   */
  private handleSocketMessage = (socket: IWebSocket) => {
    socket.on('message', (data) => {
      switch (data.toString()) {
        case 'start':
          this.startStream();
          break;

        case 'stop':
          this.stopStream();
          break;

        case 'pause':
          this.pauseStream();
          break;

        default:
          this.sendServerError('error:Unsupported command!');
          break;
      }

      const message = socket.appName + ': ' + data.toString();
      this.mainWindow?.webContents.send(
        ExportServerChannels.ClientMessage,
        message
      );
    });
  };

  /**
   * Adds listeners to the socket connection to monitor each client.
   * @param socket - The socket connection to add listeners to
   */
  private addSocketListeners = (socket: IWebSocket) => {
    socket.on('close', () => this.removeSocket(socket.id));
    socket.on('error', (_error) => {});
  };

  /**
   * Removes and disconnects the socket from the list
   * @param clientName - The id of the client/socket to be removed
   */
  public removeSocket = (socketId: string) => {
    // Find the socket index from the list and remove it
    const socketIndex = this.sockets.findIndex(
      (currSocket) => currSocket.id === socketId
    );
    const readySockIndex = this.readySockets.findIndex(
      (readySocket) => readySocket.id === socketId
    );

    // Socket has already been closed and cleaned
    if (socketIndex === -1) return;

    // Close socket and remove it
    this.sockets[socketIndex].close();
    this.sockets.splice(socketIndex, 1);

    // If no more active socket exists stop streaming.
    if (this.sockets.length === 0) this.isStreamingData = null;
    this.updateStatus();

    if (readySockIndex === -1) return;
    this.readySockets.splice(readySockIndex, 1);
  };

  /* ------------ SERVER ------------ */
  /**
   * Creates the web socket server and bind to the port
   * @returns WebSocketServer
   */
  private createServer = async () => {
    // All possible ports - 9797 is preferred
    const ports = [9797, 9898, 8080, 9090, 2424, 2525];

    // Check to find the first available port
    for (let i = 0; i < ports.length; i += 1) {
      const isPortAvailable = await this.checkPortInUse(ports[i]);
      if (isPortAvailable === true) {
        this.port = ports[i];
        break;
      }
    }

    // Check if the port was available and assigned
    if (this.port) {
      return new WebSocketServer({
        port: this.port,
        backlog: 3,
        clientTracking: false,
      });
    } else {
      throw Error('Network problem, could not find any available port');
    }
  };

  /**
   * Adds listeners to the server to monitor its status
   */
  private addServerListeners = () => {
    this.server?.on('listening', () => (this.isListening = true));

    // Listen for server errors and send it to the UI
    this.server?.on('error', (error) => {
      this.isListening = false;
      this.mainWindow?.webContents.send(
        ExportServerChannels.ServerError,
        error
      );
    });
    // Connection to server
    this.server?.on('connection', (_client, _request) => {
      this.updateStatus();
    });
    // server close event
    this.server?.on('close', () => {
      GlobalStore.removeExportServer();
    });
  };

  /**
   * Gets the local ip address of all network interfaces.
   */
  private setLocalIP = () => {
    this.ip = getLocalIP();
  };

  /**
   * Checks if the port is available.
   * @param port - Port to be check
   * @returns - True if the port is available and false otherwise.
   */
  private checkPortInUse = async (port: number) => {
    let isPortAvailable = false;
    const availablePort = await detectPort(port);
    if (availablePort === port) {
      isPortAvailable = true;
    } else {
      isPortAvailable = false;
    }
    return isPortAvailable;
  };
}

export default ExportServer;
