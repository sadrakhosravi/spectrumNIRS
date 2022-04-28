import { createServer } from 'http';
import { Server } from 'socket.io';

// Types
import { Socket } from 'socket.io';

// Enums
import { IO_SERVER } from './enums';

/**
 * The Beast communication server class
 * @version 0.1.0
 * @alpha
 */
export class BeastServer {
  /**
   * The socket io instance.
   */
  private io!: Server;
  /**
   * The beast client socket connection instance.
   */
  beast: Socket | null;

  constructor() {
    this.beast = null;

    this.createServer();
  }

  /**
   * @returns The socket io instance
   */
  public getIO() {
    return this.io;
  }

  /**
   * Creates the IO server
   */
  private createServer() {
    // Create HTTP and socket.io server
    const httpServer = createServer();
    this.io = new Server(httpServer, {
      wsEngine: require('ws').Server,
      cors: {
        origin: '*',
      },
    });

    // Node server listen
    httpServer.listen(IO_SERVER.port);
  }

  public cleanup() {}
}
