import { MessageType } from 'reader/Devices/Beast/BeastInput';
import { BEAST_CMDs } from 'reader/Devices/Beast/enums';

export interface IDeviceInput {
  /**
   * Checks whether the connection is established with the hardware.
   */
  getIsConnected(): boolean;

  /**
   * Sends a command to the Beast firmware.
   * @param command the channel/command name to send.
   * @param message the containing message.
   * @returns boolean if the message was sent of undefined if the socket
   *          is not connected.
   */
  sendCommand(command: BEAST_CMDs, message: MessageType): boolean | undefined;

  /**
   * Sends the new settings to the Beast controller
   */
  updateSettings(settings: any): void;
}
