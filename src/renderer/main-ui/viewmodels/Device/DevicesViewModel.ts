/*---------------------------------------------------------------------------------------------
 *  Device Manager Model.
 *
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import * as Comlink from 'comlink';
import {
  action,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from 'mobx';

// Models
import { DeviceModel } from '../../models/Device/DeviceModel';
import { DeviceService } from '/@/models/Device/DeviceService';
import { devices } from '@models/Device/Modules/Devices';
import { DeviceReader } from '@models/Device/DeviceReader';

// Types
import type { IReactionDisposer } from 'mobx';
import type { DeviceSettingsType } from '@models/Device/api/device-api';
import type { DeviceNameType } from '@models/Device/api/Types';
import type { IDeviceReader } from '/@/models/Device/Interfaces';

export class DevicesViewModel {
  /**
   * Active devices proxy array.
   */
  @observable public readonly devices: DeviceModel[];
  /**
   * Available device modules and their status.
   */
  @observable private readonly availableDevices: DeviceNameType[];
  /**
   * The device reader loop instance.
   */
  private readonly deviceReaderLoop: DeviceReader;
  /**
   * State of the the application recording.
   */
  @observable private isRecording: boolean;
  private readonly reactions: IReactionDisposer[];

  constructor() {
    this.devices = [];
    this.availableDevices = [];

    // Models
    this.deviceReaderLoop = new DeviceReader();

    this.isRecording = false;
    this.reactions = [];

    makeObservable(this);

    this.getAvailableDeviceModules();
    this.handleReactions();
  }

  /**
   * @returns an array of active devices.
   */
  public get activeDevices() {
    return this.devices;
  }

  /**
   * @return the all available device modules and their status.
   */
  public get allDevices() {
    return this.availableDevices;
  }

  /**
   * @return the status of recording
   */
  public get isRecordingData() {
    return this.isRecording;
  }

  /**
   * Gets the available device modules from the reader process.
   */
  @action public async getAvailableDeviceModules() {
    const devicesInfo: DeviceNameType[] = devices.map((device) => {
      // Check if the device is active.
      const isDeviceActive = this.activeDevices.find(
        (d) => d.deviceInfo?.name === device.name
      );
      return { name: device.name, isActive: isDeviceActive ? true : false };
    });
    runInAction(() => this.availableDevices.push(...devicesInfo));
  }

  /**
   * Starts device proxy models and sends a request to start the physical devices.
   */
  @action public startDevices() {
    this.isRecording = true;

    console.log('Start');
    const ts = Date.now();
    this.activeDevices.forEach((device) => device.start(ts));
    this.deviceReaderLoop.startDataAcquisition(this.devices);
  }

  /**
   * Sends a request to stop physical devices and stops device proxy models.
   */
  @action public stopDevices() {
    this.isRecording = false;
    console.log('Stop');
    this.deviceReaderLoop.stopDataAcquisitionLoop();
    const ts = Date.now();
    this.activeDevices.forEach((device) => device.stop(ts));
  }

  /**
   * Sends an IPC event to the reader process to ADD the device with
   * the passed `deviceName`.
   */
  @action public async addDevice(deviceName: string, sensorType: 'v5' | 'v6') {
    const device = DeviceService.getDeviceObj(deviceName);
    if (!device)
      throw new Error('Device object not found! Something went wrong');

    const worker = device.createWorker();
    const wrappedWorker = Comlink.wrap<IDeviceReader>(worker);
    const deviceInfo = await wrappedWorker.getDeviceInfo();

    // Create and initialize the model
    const deviceModel = new DeviceModel(
      device,
      worker,
      wrappedWorker as any,
      deviceInfo,
      sensorType
    );
    await deviceModel.init();

    runInAction(() => this.activeDevices.push(deviceModel));
  }

  /**
   * Sends an IPC event to the reader process to REMOVE the device with
   * the passed `deviceName`.
   */
  @action public async removeDevice(deviceName: string) {
    // Remove the proxy device
    const removedDeviceIndex = this.devices.findIndex(
      (device) => device.deviceInfo?.name === deviceName
    );

    if (removedDeviceIndex === -1)
      throw new Error(
        'Could not remove the device proxy model. Something went wrong!'
      );

    this.devices[removedDeviceIndex].dispose();
    runInAction(async () => {
      this.devices.splice(removedDeviceIndex, 1);
    });
  }

  /**
   * Removes all device proxies and devices from the device manager.
   */
  @action public async removeAllDevices() {
    this.devices.forEach((deviceProxy) => {
      deviceProxy.dispose();
    });
    this.devices.length = 0;
  }

  /**
   * Updates the device settings in the reader process.
   */
  public async updateDeviceSettings(
    _settings: DeviceSettingsType,
    _deviceName: string
  ) {
    // await this.reader.updateDeviceSettings(settings, deviceName);
  }

  /**
   * Disposes the the class and removes all event listeners.
   */
  public async cleanup() {
    await this.removeAllDevices();
  }

  /**
   * Handles observable reactions
   */
  private handleReactions() {
    const activeDeviceReaction = reaction(
      () => this.devices.length,
      async () => {
        this.availableDevices.length = 0;
        this.getAvailableDeviceModules();
      }
    );

    this.reactions.push(activeDeviceReaction);
  }
}
