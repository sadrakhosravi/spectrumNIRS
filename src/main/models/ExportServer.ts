import { WebSocketServer, Server, WebSocket } from 'ws';
import { BrowserWindow } from 'electron';
import detectPort from 'detect-port';

// Library
import getLocalIP, { INetwork } from '@lib/network/getLocalIP';

// Constants
import { ExportServerChannels } from '@utils/channels';
import DummyData from './DummyData';

export interface IInterface {
  ip: string | undefined;
  ipFamily: string | undefined;
  port: number | undefined;
  name: string;
}

export interface IServerStatus {
  clients: number | undefined;
  protocols: string[];
  status: string;
}

export interface IServerInfo {
  ip: INetwork[] | null;
  port: number | null;
  version: string;
}

export interface IClientStatus extends IInterface {
  state: number;
  url: undefined | string;
}

interface IWebSocket extends WebSocket, IInterface {
  id: string;
}

class ExportServer {
  #securityPhrase: 'beastspectrum-export-stream+'; // Private
  mainWindow: Electron.BrowserWindow | undefined;
  ip: INetwork[] | null;
  port: number | null;
  server: Server | null;
  isServerActive: boolean;
  isListening: boolean;
  protocols: string[];
  sockets: IWebSocket[];
  nextId: number;
  dummyData: any;

  constructor() {
    this.#securityPhrase = 'beastspectrum-export-stream+';
    this.mainWindow = BrowserWindow.getAllWindows()[0];
    this.ip = null;
    this.port = null;
    this.server = null;
    this.isListening = false;
    this.isServerActive = false;
    this.sockets = [];
    this.protocols = ['Protocol 1', 'Protocol 2'];
    this.nextId = 0;
    this.dummyData = null;
  }

  public test = async () => {
    const data = new DummyData('30min');
    this.dummyData = await data.getDummyDataFromDb();
    if (this.dummyData) {
      for (let i = 0; i < 150; i++) {
        this.sockets[0].send(this.dummyData[i].timeStamp.toString());
      }
    }
  };

  /**
   * Gets the current server status
   */
  public get serverStatus(): IServerStatus {
    return {
      clients: this.sockets.length,
      protocols: this.protocols,
      status: this.isListening ? 'Active' : 'Error',
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
        ip: socket.ip,
        ipFamily: socket.ipFamily,
        port: socket.port,
        name: socket.id,
      });
    });
    return clients;
  }

  /**
   * Starts the export websocket server
   */
  public start = async () => {
    console.log('started');
    this.server = await this.createServer();
    if (this.server) this.isServerActive = true;

    console.log(this.server.path);

    this.handleIncomingConnection();
    this.setLocalIP();
    this.addServerListeners();
  };

  /**
   * Stops the server and cleans up the memory
   */
  public stop = async () => {
    console.log('stopped');
    this.sockets.forEach((socket) => {
      socket.close();
      setTimeout(() => socket?.terminate(), 1000);
    });
    this.server?.close();

    //@ts-ignore
    setTimeout(() => (this.mainWindow = undefined), 100);
    this.sockets.length = 0;
    this.port = null;
    this.ip = null;
  };

  /**
   * Sends the server information to the UI
   */
  public sendServerInfo = () => {
    this.mainWindow?.webContents.send(
      ExportServerChannels.ServerInfo,
      this.serverInfo
    );
  };

  /**
   * Sends the server status to the UI
   */
  public sendServerStatus = () => {
    this.mainWindow?.webContents.send(ExportServerChannels.ServerStatus, {
      serverStatus: this.serverStatus,
      clientStatus: this.clientsStatus,
    });
  };

  /**
   * Sends the server error to the UI
   * @param message - The error message string
   */
  public sendServerError = (message: string) => {
    this.mainWindow?.webContents.send(
      ExportServerChannels.ServerError,
      message
    );
  };

  /**
   * Removes and disconnects the socket from the list
   * @param clientName - The id of the client/socket to be removed
   */
  public removeSocket = (socketId: string) => {
    console.log('REMOVE SOCKET');
    // Find the socket index from the list and remove it
    const socketIndex = this.sockets.findIndex(
      (currSocket) => currSocket.id === socketId
    );

    // Socket has already been closed and cleaned
    if (socketIndex === -1) return;
    console.log('REMOVE SOCKET2');

    this.sockets[socketIndex].close();
    this.sockets.splice(socketIndex, 1);

    // Send the updated status
    this.sendServerStatus();
  };

  /**
   * Adds listeners to the server to monitor its status
   */
  private addServerListeners = () => {
    this.server?.addListener('listening', () => (this.isListening = true));

    // Listen for server errors and send it to the UI
    this.server?.addListener('error', (error) => {
      this.isListening = false;
      this.mainWindow?.webContents.send(
        ExportServerChannels.ServerError,
        error
      );
    });
    // Connection to server
    this.server?.addListener('connection', (_client, _request) => {
      this.sendServerStatus();
    });
    // server close event
    this.server?.addListener('close', () => {
      this.mainWindow?.webContents.send(ExportServerChannels.Restarted);
      this.mainWindow?.webContents.send(ExportServerChannels.ServerStatus, {
        status: 'Restarting',
      });
    });
  };

  /**
   * Adds listeners to the socket connection to monitor each client.
   * @param socket - The socket connection to add listeners to
   */
  private addSocketListeners = (socket: IWebSocket) => {
    socket.on('close', () => this.removeSocket(socket.id));
    socket.on('error', (error) => this.sendServerError(error.message));
    this.test();
  };

  /**
   * Handles the messaging of each web socket
   * @param socket - The web socket
   */
  private handleSocketMessage = (socket: IWebSocket) => {
    socket.on('message', (data) => {
      console.log(data.toString());
      const message = socket.id + ' ' + data.toString();
      this.mainWindow?.webContents.send(
        ExportServerChannels.ClientMessage,
        message
      );
    });
  };

  /**
   * Handles the incoming connection
   */
  private handleIncomingConnection = async () => {
    const secKey = 'security-phrase';

    this.server?.on('connection', (socket: IWebSocket, request) => {
      const isTrustable = request.headers[secKey] === this.#securityPhrase;

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
      socket.ip = request.socket.remoteAddress;
      socket.ipFamily = request.socket.remoteFamily;
      socket.port = request.socket.remotePort;

      // Keep track of each socket.
      this.sockets.push(socket as IWebSocket);

      // Add listeners to the socket
      this.handleSocketMessage(socket);
      this.addSocketListeners(socket);
    });
  };

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
