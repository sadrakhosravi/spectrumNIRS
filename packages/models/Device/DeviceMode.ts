/*---------------------------------------------------------------------------------------------
 *  Device Model.
 *  Holds logic related to the device selection and configuration.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, makeObservable, observable, reaction } from 'mobx';

// Types
import type { IReactionDisposer } from 'mobx';

export type DeviceInfoType = {
  name: string;
  numOfPDs: number;
  numOfLEDs: number;
  defaultCalibrationFactor: number;
  activeLEDs?: number;
  activePDs?: number;
};

export class DeviceModel {
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
    this.name = deviceInfo.name;
    this.LEDs = new Array(deviceInfo.numOfLEDs).fill(0).map((_, i) => (_ = i + 1));
    this.PDs = new Array(deviceInfo.numOfPDs).fill(0).map((_, i) => (_ = i + 1));
    this.calibrationFactor = deviceInfo.defaultCalibrationFactor;

    this._activeLEDs = deviceInfo.activeLEDs || 1;
    this._activePDs = deviceInfo.activePDs || 1;

    this.isConnected = false;
    this.isStarted = false;
    this._LEDIntensities = new Array(deviceInfo.numOfLEDs).fill(0);

    this.reactions = [];

    makeObservable(this);
    this.handleReactions();
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
   * Handles observable changes.
   */
  private handleReactions() {
    const LEDChangeReactionDisposer = reaction(
      () => this._activePDs,
      () => {
        console.log('Reaction');
      },
    );

    const PDChangeReactionDisposer = reaction(
      () => this._activePDs,
      () => {
        console.log('Reaction');
      },
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
    this.reactions.forEach((diposer) => diposer());
    this.reactions.length = 0;
  }
}
