import net from 'net';

export interface IDeviceInput {
  /**
   * Creates the connection interface with the physical device
   */
  createConnectionInterface: () => net.Socket;

  /**
   * Connects to the controller of the device
   */
  connect: () => any; //TODO: Change the any to work with the supported interfaces

  /**
   * Sends commands/messages to the device
   * @returns true if successful and false if failed.
   */
  sendToDevice: (message: string) => boolean;

  /**
   * Whether the connection with the device input in open
   */
  isConnected: () => boolean;
}

type InputType = 'websocket' | 'stdin';

/**
 * Sending messages to the physical device
 */
class DeviceInput {
  inputType: InputType;
  address?: string | undefined;
  port?: number | undefined;

  constructor(inputType: InputType, address?: string, port?: number) {
    this.inputType = inputType;
    this.address = address;
    this.port = port;
  }

  /**
   * @returns the input type of the device
   */
  getInputType = () => this.inputType;

  /**
   * Sends a message to the device controller
   * @param message - the message to be sent to the device controller
   */
  send = (message: string) => {
    if (this.inputType === 'websocket' && this.address && this.port) {
      const deviceSocket = new net.Socket();
      deviceSocket.connect(this.port, this.address);
      deviceSocket.write(message);

      setTimeout(() => deviceSocket.destroy(), 50);
    }
  };

  connect = () => {};
}

export default DeviceInput;
