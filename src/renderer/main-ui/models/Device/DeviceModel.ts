/*---------------------------------------------------------------------------------------------
 *  Device Model Model.
 *  Handles the communication between the UI thread and the device worker.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import * as Comlink from 'comlink';
import { deserialize } from 'v8';
import {
  action,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
  runInAction,
  toJS,
} from 'mobx';
import { devices } from './Modules/Devices';
import ServiceManager from '@services/ServiceManager';

// Models
import { DeviceChartManagerModel } from './DeviceChartManager';
import { DeviceDataManager } from './DeviceDataManagerModel';

// View Models
import { appRouterVM } from '/@/viewmodels/VMStore';
import { AppNavStatesEnum } from '@utils/types/AppStateEnum';

// Types & Interfaces
import type { IDisposable } from '../Base/IDisposable';
import type { DeviceDataTypeWithMetaData, DeviceInfoType } from './api/Types';
import type { DeviceConfigSavedType } from './api/device-api';
import { BeastDeviceReader } from './Modules/Beast/BeastDeviceReader';

export type DeviceSettingsType = {
  numOfPDs: number;
  numOfLEDs: number;
  LEDValues: number[];
};

export class DeviceModel implements IDisposable {
  public readonly id: number;
  public readonly name: string;
  /**
   * The device worker instance.
   */
  @observable private readonly worker: Worker;
  /**
   * The Comlink wrapped device worker object.
   */
  private readonly deviceReader: Comlink.Remote<BeastDeviceReader>;
  /**
   * The type of the sensor used for the Beast device.
   */
  private readonly sensorType: 'v5' | 'v6';
  /**
   * The device info object.
   */
  public readonly _deviceInfo: DeviceInfoType;

  /**
   * The device chart channel manager instance.
   */
  private deviceCharts: DeviceChartManagerModel;
  /**
   * Device data manager instance.
   */
  private deviceDataManager: DeviceDataManager;
  /**
   * The device to software connection status.
   */
  @observable private _isConnected: boolean;
  /**
   * The device data streaming status.
   */
  @observable private _isStreaming: boolean;
  /**
   * If the device has settings boolean.
   */
  @observable private _hasSettings: boolean;
  /**
   * The selected PD data to display.
   */
  @observable private _selectedPD: number;
  /**
   * The LED intensities of the device.
   */
  @observable private _LEDIntensities: number[];
  private readonly reactions: IReactionDisposer[];
  private readonly pdChannels: string[];

  constructor(
    deviceObj: typeof devices[0],
    worker: Worker,
    wrappedWorker: Comlink.Remote<BeastDeviceReader>,
    deviceInfo: DeviceInfoType,
    sensorType: 'v5' | 'v6'
  ) {
    this.id = deviceObj.id;
    this._deviceInfo = deviceInfo;
    this.name = deviceObj.name;
    this.worker = worker;
    this.deviceReader = wrappedWorker;
    this.sensorType = sensorType;

    this.pdChannels = [];

    if (this.sensorType === 'v5')
      this.pdChannels.push(
        'Ambient',
        'LED11',
        'LED12',
        'LED13',
        'LED14',
        'LED15'
      );

    if (this.sensorType === 'v6')
      this.pdChannels.push(
        'Ambient',
        'LED1',
        'LED2',
        'LED3',
        'LED4',
        'LED5',
        'LED6',
        'LED7',
        'LED8'
      );

    // Models
    this.deviceCharts = new DeviceChartManagerModel(
      this.deviceInfo.calculatedChannelNames,
      this.pdChannels,
      this.samplingRate
    );
    this.deviceDataManager = new DeviceDataManager(
      this.deviceCharts,
      this.sensorType,
      this.calcChannelNames
    );

    // Observables.
    this._isConnected = false;
    this._isStreaming = false;
    this._hasSettings = false;

    this._selectedPD = 1;
    this._LEDIntensities = new Array(this.LEDs.length).fill(0);

    this.reactions = [];

    makeObservable(this);

    this.handleReactions();
  }

  //#region getters

  /**
   * Device connection status
   */
  public get isConnected() {
    return this._isConnected;
  }

  public get isStreaming() {
    return this._isStreaming;
  }

  public get deviceInfo() {
    return toJS(this._deviceInfo as DeviceInfoType);
  }

  public get samplingRate() {
    return this._deviceInfo.defaultSamplingRate;
  }

  public get LEDs() {
    return new Array(this.deviceInfo.numOfChannelsPerPD - 1)
      .fill(0)
      .map((_, i) => (_ = i + 1));
  }

  public get PDs() {
    return this.sensorType === 'v5' ? [1] : [1, 2];
  }

  public get PDChannelNames() {
    return this.pdChannels;
  }

  public get calcChannelNames() {
    return this.deviceInfo.calculatedChannelNames as string[];
  }

  public get selectedPD() {
    return this._selectedPD;
  }

  public get LEDIntensities() {
    return this._LEDIntensities;
  }

  public get hasSettings() {
    return this._hasSettings;
  }

  public get sensor() {
    return this.sensorType;
  }

  /**
   * The current device configuration as an object.
   */
  public get currConfigs(): DeviceConfigSavedType {
    return {
      ...this.deviceInfo,
      LEDValues: toJS(this.LEDIntensities),
      numOfLEDs: this.deviceInfo.numOfChannelsPerPD - 1,
      numOfPDs: this.deviceInfo.numOfADCs,
      samplingRate: this.samplingRate,
      activeLEDs: new Array(this.deviceInfo.numOfChannelsPerPD - 1).fill(true),
      activePDs: new Array(this.deviceInfo.numOfADCs).fill(true),
    };
  }

  /**
   * Retrieves the internal buffer of the worker device.
   */
  public getDeviceData() {
    this.deviceReader.getData().then((_data: Buffer | null) => {
      // eslint-disable-next-line no-useless-return
      if (_data === null) return; // There was no data buffered.
      const data = deserialize(_data) as DeviceDataTypeWithMetaData[];

      if (appRouterVM.route === AppNavStatesEnum.RECORD) {
        // Send the data to be stored in the database.
        ServiceManager.dbConnection.deviceDataSaver.addData(data);
      }

      this.deviceDataManager.handleData(data);
    });
  }

  //#endregion

  //#region setters
  /**
   * Sets the device connection status.
   */
  public setConnectionStatus(status: boolean) {
    runInAction(() => (this._isConnected = status));
  }

  /**
   * Sets the currently selected PD.
   */
  @action public setSelectedPD(num: number) {
    this._selectedPD = num;
  }

  /**
   * Updates the current LED intensities.
   * @param intensity the new intensity.
   * @param index the index of the led to update.
   */
  @action public async updateLEDIntensities(intensity: number, index: number) {
    this._LEDIntensities[index] = intensity;
    await this.deviceReader.handleDeviceSettingsUpdate({
      numOfLEDs: 5,
      numOfPDs: 1,
      LEDValues: toJS(this._LEDIntensities),
    });
  }

  //#endregion

  /**
   * Initializes the device and does the initial checks.
   */
  public async init() {
    // Send the device status setter function.
    await this.deviceReader.init(
      Comlink.proxy(this.setConnectionStatus.bind(this))
    );

    console.log('Class');
    console.log(this.deviceReader);

    this.deviceCharts.createDeviceCharts();
    this.deviceReader.setSensorType(this.sensorType);
  }

  /**
   * Starts the device.
   */
  public start(timestamp: number) {
    this.deviceReader.handleDeviceStart();
    this.deviceDataManager.start(timestamp);
  }

  /**
   * Stops the device.
   */
  public async stop(_timestamp: number) {
    await this.deviceReader.handleDeviceStop();
    this.deviceDataManager.stop();
  }

  /**
   * Handles observable change reactions.
   */
  private handleReactions() {
    const handleDeviceInfoReaction = reaction(
      () => this.deviceInfo,
      () => this.deviceCharts.createDeviceCharts()
    );

    const connectionReaction = reaction(
      () => this._isConnected,
      () => console.log(this._isConnected)
    );

    const PDChangeReaction = reaction(
      () => this.selectedPD,
      () => this.deviceDataManager.setSelectedPD(toJS(this.selectedPD))
    );

    this.reactions.push(
      handleDeviceInfoReaction,
      connectionReaction,
      PDChangeReaction
    );
  }

  /**
   * Disposes the observables and frees allocated resources for garbage collection.
   */
  dispose(): boolean {
    // Remove the reactions, if any.
    this.reactions.forEach((reaction) => reaction());

    this.deviceCharts.dispose();

    // Release the comlink proxy to be garbage collected.
    this.deviceReader[Comlink.releaseProxy]();

    // Terminate the worker.
    this.worker.terminate();

    return true;
  }
}
