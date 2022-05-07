/*---------------------------------------------------------------------------------------------
 *  Device Model.
 *  Holds logic related to the device selection and configuration.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, makeObservable, observable, reaction } from 'mobx';
import { ipcRenderer } from 'electron';
import { ReaderChannels } from '../../utils/channels';

// Services
import MainWinIPCService from '../../renderer/main-ui/MainWinIPCService';

// Types
import type { IReactionDisposer } from 'mobx';
import type { DeviceSettingsType } from '../../viewmodels/Device/DeviceSettingsViewModel';
import type { UnpackedDataType } from '../../renderer/reader/Devices/Beast/BeastParser';

// View Model
import { chartVM } from '../../viewmodels/VMStore';

export type DeviceInfoType = {
  id: string;
  name: string;
  numOfPDs: number;
  numOfLEDs: number;
  samplingRate: number;
  defaultCalibrationFactor: number;
  activeLEDs?: number;
  activePDs?: number;
};

export class DeviceModel {
  public readonly id: string;
  /**
   * Device name.
   */
  public readonly name: string;
  /**
   * Device LEDs as an array.
   */
  public readonly LEDs: number[];
  /**
   * Device PDs as an array.
   */
  public readonly PDs: number[];
  /**
   * Device calibration factor.
   */
  @observable private calibrationFactor: number;
  /**
   * Current active LEDs.
   */
  @observable private _activeLEDs: number;
  /**
   * Current active PDs.
   */
  @observable private _activePDs: number;
  /**
   * The current sampling rate of the device.
   */
  @observable private _samplingRate: number;
  /**
   * Device connection status.
   */
  @observable private isConnected: boolean;
  /**
   * Device recording status.
   */
  @observable private isStarted: boolean;
  /**
   * LED intensities
   */
  @observable private _LEDIntensities: number[];
  /**
   * Observable reaction disposer array.
   */
  private reactions: IReactionDisposer[];

  constructor(deviceInfo: DeviceInfoType) {
    this.id = deviceInfo.id;
    this.name = deviceInfo.name;
    this.LEDs = new Array(deviceInfo.numOfLEDs).fill(0).map((_, i) => (_ = i + 1));
    this.PDs = new Array(deviceInfo.numOfPDs).fill(0).map((_, i) => (_ = i + 1));
    this.calibrationFactor = deviceInfo.defaultCalibrationFactor;

    this._activeLEDs = deviceInfo.activeLEDs || 1;
    this._activePDs = deviceInfo.activePDs || 1;
    this._samplingRate = deviceInfo.samplingRate;

    this.isConnected = false;
    this.isStarted = false;
    this._LEDIntensities = new Array(deviceInfo.numOfLEDs).fill(0);

    this.reactions = [];

    makeObservable(this);
    this.handleReactions();
    this.initListeners();
    this.listenForData();
  }

  /**
   * @returns the device connection status as boolean.
   */
  public get isDeviceConnected() {
    return this.isConnected;
  }

  /**
   * The total number of active LEDs.
   */
  public get activeLEDs() {
    return this._activeLEDs;
  }

  /**
   * The total number of active PDs.
   */
  public get activePDs() {
    return this._activePDs;
  }

  /**
   * The current sampling rate of the device.
   */
  public get samplingRate() {
    return this._samplingRate;
  }

  /**
   * @returns the current LED intensities.
   */
  public get LEDIntensities() {
    return this._LEDIntensities;
  }

  /**
   * @returns the device recording status.
   */
  public get isDeviceStarted() {
    return this.isStarted;
  }

  /**
   * @returns the device calibration factor.
   */
  public get deviceCalibrationFactor() {
    return this.calibrationFactor;
  }

  /**
   * Sets whether the device is connected or not.
   */
  @action public setIsDeviceConnected(value: boolean) {
    this.isConnected = value;
  }

  /**
   *
   * Sets whether the device is recording or not.
   */
  @action public setIsDeviceStarted(value: boolean) {
    this.isStarted = value;
  }

  /**
   * Sets the total active LEDs number.
   */
  @action public setActiveLEDs(num: number) {
    this._activeLEDs = num;
  }

  /**
   * Sets the total active PDs number.
   */
  @action public setActivePDs(num: number) {
    this._activePDs = num;
  }

  /**
   * Updates the current LED intensities.
   * @param intensity the new intensity.
   * @param index the index of the led to update.
   */
  @action public setLEDIntensity(intensity: number, index: number) {
    this._LEDIntensities[index] = intensity;
  }

  /**
   * Sets the device calibration factor.
   */
  @action public setCalibrationFactor(num: number) {
    this.calibrationFactor = num;
  }

  /**
   * Initializes all event listeners.
   */
  private initListeners() {
    this.listenForDeviceConnection();
  }

  /**
   * Listens for device connection.
   */
  @action private listenForDeviceConnection() {
    ipcRenderer.on(ReaderChannels.DEVICE_CONNECTED, () => {
      this.isConnected = true;
    });
  }

  /**
   * Sends the new device settings to the reader process.
   */
  public sendDeviceSettingsToReader = () => {
    // Should wait for react to re-render first.
    requestAnimationFrame(() => {
      MainWinIPCService.sendToReader(
        ReaderChannels.DEVICE_SETTING_UPDATE,
        this.getDeviceSettings(),
      );
    });
  };

  /**
   * @returns the device settings read from the UI.
   * TODO: Update the LED intensities to use observable instead of getElementById.
   */
  private getDeviceSettings = () => {
    console.log('Update');
    // The settings object
    const settings: DeviceSettingsType = {
      numOfPDs: this.activePDs,
      numOfLEDs: this.activeLEDs,
      LEDValues: [],
    };

    for (let i = 0; i < this.activeLEDs; i++) {
      const ledSlider = document.getElementById('led-intensities-' + i) as HTMLInputElement;
      settings.LEDValues.push(~~ledSlider.value);
    }

    return settings;
  };

  /**
   * Listens for data from the reader process and adds it to the series.
   */
  private listenForData() {
    ipcRenderer.on(ReaderChannels.DEVICE_DATA, (_event, data: UnpackedDataType) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const channelData = data[`ch${this._activePDs}`] as number[];
      const ledNums = data['led_nums'];

      const deviceData: any = {
        led0: [],
        led1: [],
        led2: [],
        led3: [],
        led4: [],
        led5: [],
        led6: [],
        led7: [],
        led8: [],
        led9: [],
        led10: [],
        led11: [],
        led12: [],
        led13: [],
        led14: [],
        led15: [],
      };

      for (let i = 0; i < 512 + 1; i++) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        deviceData[`led${ledNums[i]}`].push(channelData[i]);
      }

      for (let j = 0; j < 16; j++) {
        chartVM.charts[j].series[0].addArrayY(deviceData[`led${j}`]);
      }
    });
  }

  /**
   * Handles observable changes.
   */
  private handleReactions() {
    const LEDChangeReactionDisposer = reaction(
      () => this._activeLEDs,
      () => this.sendDeviceSettingsToReader(),
    );

    const PDChangeReactionDisposer = reaction(
      () => this._activePDs,
      () => this.sendDeviceSettingsToReader(),
    );

    const intensityChange = reaction(
      () => this._LEDIntensities,
      () => {
        console.log('Intensity Change');
      },
    );

    this.reactions.push(LEDChangeReactionDisposer, PDChangeReactionDisposer, intensityChange);
  }

  /**
   * Cleans up the reactions.
   */
  public cleanup() {
    this.reactions.forEach((disposer) => disposer());
    this.reactions.length = 0;

    // Remove listeners
    ipcRenderer.removeAllListeners(ReaderChannels.DEVICE_CONNECTED);
  }
}
