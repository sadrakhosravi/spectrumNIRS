import { createServer } from 'http';
import { Server } from 'socket.io';

// Interfaces
import { INIRSDevice } from 'reader/Interfaces';
import type { Socket } from 'socket.io';
import type { DeviceInfoType } from 'reader/api/Types';

// Enums / Interfaces
import { IO_SERVER } from './BeastCommandsEnum,';

export class BeastPhysicalDevice implements INIRSDevice {
  /**
   * The socket io server instance
   */
  private io: Server;
  /**
   * The beast connection socket instance.
   */
  private beast: Socket | null;
  constructor() {
    this.io = this.createServer();
    this.beast = null;
  }

  /**
   * @returns the name of the device - `Beast`.
   */
  public static getName(): 'Beast' {
    return 'Beast';
  }

  /**
   * @returns the device information object.
   */
  public getDeviceInfo(): DeviceInfoType {
    return {
      id: this.getDeviceSerialNumber(),
      name: BeastPhysicalDevice.getName(),
      version: this.getVersion(),
      numOfChannelsPerPD: this.getSupportedLEDNum(),
      numOfADCs: this.getSupportedPDNum(),
      supportedSamplingRate: this.getSupportedSamplingRates(),
      defaultSamplingRate: this.getDefaultSamplingRate(),
      PDChannelNames: this.getPDChannelNames(),
      calculatedChannelNames: this.getCalculatedChannelNames(),
      hasProbeSettings: true,
    };
  }

  /**
   * @returns the maximum number of supported LEDs
   */
  public getSupportedLEDNum() {
    return 15;
  }

  /**
   * @returns the maximum supported number of PDs
   */
  public getSupportedPDNum() {
    return 7;
  }

  /**
   * @returns the current beast socket communication instance.
   */
  public getIO() {
    return this.beast as Socket;
  }

  /**
   * @returns the beast connection instance or null of not connected.
   */
  public getClient() {
    return this.beast;
  }

  /**
   * @returns a boolean if the beast has joined the Spectrum's IO server.
   */
  public getIsConnected() {
    return this.beast ? true : false;
  }

  /**
   * @returns the current device communication plugin version.
   */
  public getVersion() {
    return '0.1.0';
  }

  /**
   * @returns the default sampling rate of the device.
   */
  public getDefaultSamplingRate() {
    return 1000;
  }

  /**
   * @returns the device serial number.
   */
  public getDeviceSerialNumber() {
    return 'beast-ibl-zx1';
  }

  /**
   * @returns an array of all the supported sampling rates.
   */
  public getSupportedSamplingRates() {
    return [1000, 500, 250, 100, 50, 30, 20, 10];
  }

  /**
   * @returns the PD channel names.
   */
  public getPDChannelNames() {
    const channelNames = ['Ambient'];
    for (let i = 0; i < this.getSupportedLEDNum(); i++) channelNames.push(`LED${i + 1}`);
    return channelNames;
  }

  /**
   * @returns the calculated channel names.
   */
  public getCalculatedChannelNames() {
    return ['O2Hb', 'HHb', 'THb', 'TOI'];
  }

  /**
   * @returns the current device communication instance.
   */
  public getDevice() {
    return this.beast as Socket;
  }

  /**
   * Waits for device connection.
   */
  public waitForDevice(): Promise<boolean> {
    return new Promise((resolve) => {
      // On device join, resolve the promise
      this.io.on('connection', (socket) => {
        this.beast = socket;

        return resolve(true);
      });
    });
  }

  /**
   * Cleans up the listeners
   */
  public cleanup() {
    this.io.disconnectSockets();
    this.io.close((err) => {
      throw new Error(err?.message);
    });
  }

  /**
   * Creates the IO server for beast's connection
   */
  private createServer() {
    // Create HTTP and socket.io server
    const httpServer = createServer();
    const io = new Server(httpServer, {
      wsEngine: require('ws').Server,
      cors: {
        origin: '*',
      },
    });

    // Node server listen
    httpServer.listen(IO_SERVER.port);

    return io;
  }
}
