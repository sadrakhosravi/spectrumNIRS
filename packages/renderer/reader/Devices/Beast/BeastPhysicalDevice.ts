import { createServer } from 'http';
import { Server } from 'socket.io';

// Types

// Enums / Interfaces
import { IO_SERVER } from './enums';

export class BeastPhysicalDevice {
  /**
   * The socket io server instance
   */
  private io: Server;
  /**
   * The beast connection socket instance.
   */
  private beast: null;
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
   * @returns the maximum number of supported LEDs
   */
  public static getSupportedLEDNum() {
    return 15;
  }

  /**
   * @returns the maximum supported number of PDs
   */
  public static getSupportedPDNum() {
    return 7;
  }

  /**
   * @returns the current socket.io server instance.
   */
  public getIO() {
    return this.io;
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
