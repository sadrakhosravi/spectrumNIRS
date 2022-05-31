import { MessageType } from 'reader/Devices/Beast/BeastInput';

export interface IDeviceInput {
  /**
   * Checks whether the connection is established with the hardware.
   */
  getIsConnected(): boolean;

  /**
   * Sets the device io instance for communication.
   * Typically this should happen after the device is connected.
   */
  setIO(io: any): void;

  /**
   * Sends a command to the Beast firmware.
   * @param command the channel/command name to send.
   * @param message the containing message.
   * @returns boolean if the message was sent of undefined if the socket
   *          is not connected.
   */
  sendCommand(command: string | undefined, message: MessageType | any): boolean | undefined;
}
