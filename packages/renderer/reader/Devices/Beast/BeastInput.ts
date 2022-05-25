import { BeastCmd } from './BeastCommandsEnum,';

// Types
import type { Socket } from 'socket.io';
import { IDeviceInput } from 'reader/Interfaces';
import type { DeviceSettingsType } from '../../api/device-api';

export type MessageType = string | string[] | boolean | number | number[];

export class BeastInput implements IDeviceInput {
  /**
   * The Beast socket.io connection instance.
   */
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  /**
   * Checks whether the connection is established with the hardware.
   */
  public getIsConnected() {
    return this.socket.connected;
  }

  /**
   * Sends a command to the Beast firmware.
   * @param command the channel/command name to send.
   * @param message the containing message.
   * @returns boolean if the message was sent of undefined if the socket
   *          is not connected.
   */
  public sendCommand(command: BeastCmd, message: MessageType) {
    if (!this.getIsConnected()) return;
    return this.socket.emit(command, message);
  }

  /**
   * Sends the new settings to the Beast controller
   */
  public updateSettings(settings: DeviceSettingsType) {
    // Reset the previous data
    const formattedSettings = this.parseSettings(settings);
    console.log(formattedSettings);
    const status = this.socket.emit(BeastCmd.SET_SETTINGS, formattedSettings);
    return status;
  }

  /**
   * Parses the user input settings for the Beast controller.
   * @param settings the settings object to parse.
   * @returns the correctly formatted object to be sent to the controller.
   */
  private parseSettings(settings: DeviceSettingsType) {
    // Get the num of LEDs and PDs that will be active
    // const { numOfLEDs } = settings;

    // If less than 16 settings are sent, fix the array
    if (settings.LEDValues.length < 16) {
      const diff = 16 - settings.LEDValues.length;

      for (let i = 0; i < diff; i++) {
        settings.LEDValues.push(0);
      }
    }

    // Parse the intensities to the required hardware byte type
    const virtual_src_addr = new Array(4);

    // Format LEDs 1 to 4
    const LED1To4 =
      this.numTo8BitsBinary(settings.LEDValues[3]) +
      this.numTo8BitsBinary(settings.LEDValues[2]) +
      this.numTo8BitsBinary(settings.LEDValues[1]) +
      this.numTo8BitsBinary(settings.LEDValues[0]);

    // Add it to the final array
    virtual_src_addr[3] = parseInt(LED1To4.padEnd(32, '0'), 2);

    // Format LEDs 5 to 8
    const LED5To8 =
      this.numTo8BitsBinary(settings.LEDValues[7]) +
      this.numTo8BitsBinary(settings.LEDValues[6]) +
      this.numTo8BitsBinary(settings.LEDValues[5]) +
      this.numTo8BitsBinary(settings.LEDValues[4]);

    // Add it to the final array
    virtual_src_addr[2] = parseInt(LED5To8.padEnd(32, '0'), 2);

    // Format LEDs 9 to 12
    const LED9To12 =
      this.numTo8BitsBinary(settings.LEDValues[11]) +
      this.numTo8BitsBinary(settings.LEDValues[10]) +
      this.numTo8BitsBinary(settings.LEDValues[9]) +
      this.numTo8BitsBinary(settings.LEDValues[8]);

    // Add it to the final array
    virtual_src_addr[1] = parseInt(LED9To12.padEnd(32, '0'), 2);

    // Format LEDs 12 to 15
    const LED15To12 =
      this.numTo8BitsBinary(settings.LEDValues[15]) +
      this.numTo8BitsBinary(settings.LEDValues[14]) +
      this.numTo8BitsBinary(settings.LEDValues[13]) +
      this.numTo8BitsBinary(settings.LEDValues[12]);

    // Add it to the final array
    virtual_src_addr[0] = parseInt(LED15To12.padEnd(32, '0'), 2);

    // Create the final object for to be sent to the controller
    const dataToSend = {
      pd_num: 7, // TODO: Make it so that the user can select it.
      led_num: 15 + 1,
      virtual_src_addr_4: virtual_src_addr[0],
      virtual_src_addr_5: virtual_src_addr[1],
      virtual_src_addr_6: virtual_src_addr[2],
      virtual_src_addr_7: virtual_src_addr[3],
    };

    return dataToSend;
  }

  /**
   * @returns the 8 bits binary version of the passed number
   */
  private numTo8BitsBinary(num: number) {
    return num.toString(2).padStart(8, '0');
  }
}
