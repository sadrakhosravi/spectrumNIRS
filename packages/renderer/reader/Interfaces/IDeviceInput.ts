export interface IDeviceInput {
  /**
   * Creates the connection interface with the physical device
   */
  createConnectionInterface: () => any;

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

  /**
   * Closes the connection with device's input stream/interface
   */
  closeConnection: () => boolean;
}
