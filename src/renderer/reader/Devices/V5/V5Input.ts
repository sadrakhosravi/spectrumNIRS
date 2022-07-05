import net from 'net';

// Types & Interfaces
import { IDeviceInput } from '../../Interfaces';

export type MessageType = string | string[];

export class V5Input implements IDeviceInput {
  /**
   * The Beast socket.io connection instance.
   */
  private connection: net.Socket | null;

  constructor() {
    this.connection = null;
  }

  /**
   * Checks whether the connection is established with the hardware.
   */
  public getIsConnected() {
    return this.connection ? true : false;
  }

  /**
   * V5 does not require IO to be set. It works with tcp connection.
   */
  setIO(_io: any): void {
    throw new Error('V5 does not have this method.');
  }

  /**
   * Sends a command to the V5 data reader process via sockets.
   * @param command the channel/command name to send.
   * @param message the containing message.
   * @returns boolean if the message was sent of undefined if the socket
   *          is not connected.
   */
  public sendCommand(_command: undefined, message: string) {
    const DRIVER_SOCKET_IP = '127.0.0.1';
    const DRIVER_SOCKET_PORT = 1337;

    const mySocket = new net.Socket();
    mySocket.connect(DRIVER_SOCKET_PORT, DRIVER_SOCKET_IP, () => {
      console.log('Connection Established');
    });

    let response = mySocket.write(message);

    mySocket.prependOnceListener('error', (data) => {
      if (data) response = false;
      console.log(data);
    });

    mySocket.prependOnceListener('close', () =>
      console.log('Socket Destroyed')
    );
    return response;
  }

  /**
   * Closes the TCP connection with the data reader process.
   * For V5, after every message sent, we have to close the connection.
   */
  public closeConnection = () => {
    if (this.connection) {
      this.connection.destroy();
      this.connection = null;
      return true;
    }

    return false;
  };
}
