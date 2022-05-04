/*---------------------------------------------------------------------------------------------
 *  Device Settings View Model.
 *  Uses Mobx observable pattern.
 *  Handles the logic for probe settings.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

// Types
import { action, makeObservable, observable } from 'mobx';

// IPC Service
import MainWinIPCService from '../../renderer/main-ui/MainWinIPCService';
import ReaderChannels from '../../utils/channels/ReaderChannels';

export type DeviceSettingsType = {
  numOfPDs: number;
  numOfLEDs: number;
  LEDValues: number[];
};

export class DeviceSettingsViewModel {
  /**
   * Device connections status
   */
  @observable private isConnected: boolean;
  /**
   * The name of the current device
   */
  @observable public deviceName: string;
  /**
   * The number of active PDs
   */
  @observable public activePDs: number;
  /**
   * The number of active LEDs
   */
  @observable public activeLEDs: number;
  /**
   * The total number of supported LEDs from the hardware
   */
  @observable public readonly supportedLEDNum: number[];
  /**
   * The total number of supported PDs from the hardware
   */
  @observable public readonly supportedPDNum: number[];

  constructor() {
    this.isConnected = false;
    this.deviceName = 'Beast';
    this.activePDs = 1;
    this.activeLEDs = 1;

    this.supportedLEDNum = new Array(15).fill(0).map((_, i) => (_ = i + 1));
    this.supportedPDNum = new Array(7).fill(0).map((_, i) => (_ = i + 1));

    makeObservable(this);
  }

  /**
   * @returns the device connection status as boolean.
   */
  public get isDeviceConnected() {
    return this.isConnected;
  }

  /**
   * Sets whether the device is connected or not.
   */
  @action public setIsDeviceConnected(value: boolean) {
    this.isConnected = value;
  }

  @action public setActiveLEDs(num: number) {
    this.activeLEDs = num;
  }

  @action public setActivePDs(num: number) {
    this.activePDs = num;
  }

  /**
   * Sends the probe settings data to the reader process.
   */
  public handleDeviceSettingsUpdate = () => {
    console.log('Update');
    // The settings object
    const settings: DeviceSettingsType = {
      numOfPDs: this.activePDs,
      numOfLEDs: this.activeLEDs,
      LEDValues: [],
    };
    console.log(this.activeLEDs);

    for (let i = 0; i < this.activeLEDs; i++) {
      const ledSlider = document.getElementById('led-intensities-' + i) as HTMLInputElement;
      settings.LEDValues.push(~~ledSlider.value);
    }

    MainWinIPCService.sendToReader(ReaderChannels.DEVICE_SETTING_UPDATE, settings);
  };
}
