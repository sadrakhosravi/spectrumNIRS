/*---------------------------------------------------------------------------------------------
 *  Device Manager Model.
 *
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import {
  action,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from 'mobx';
import Comlink from 'comlink';

// Store
import { AppGlobalStates } from '@dataStore';

// Models
import { DeviceModelProxy } from '@models/Device/DeviceModelProxy';

// Types
import type { IReactionDisposer } from 'mobx';
import type DeviceManager from 'reader/models/DeviceManager';
import type { DeviceSettingsType } from 'reader/api/device-api';
import type { DeviceNameType } from 'reader/api/Types';

export class DeviceManagerViewModel {
  /**
   * The Comlink Remote device manager instance.
   */
  private readonly reader: Comlink.Remote<DeviceManager>;
  /**
   * Active devices proxy array.
   */
  @observable public readonly deviceProxies: DeviceModelProxy[];
  /**
   * Available device modules and their status.
   */
  @observable private readonly availableDevices: DeviceNameType[];
  /**
   * State of the the application recording.
   */
  @observable private readonly isRecording: boolean;
  private readonly reactions: IReactionDisposer[];

  constructor() {
    this.reader = AppGlobalStates.reader;
    this.deviceProxies = [];
    this.availableDevices = [];

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
    return this.deviceProxies;
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
    const devices = await this.reader.getAllDeviceNames();
    this.availableDevices.length = 0;
    this.availableDevices.push(...devices);
  }

  public startDevices() {}

  public stopDevices() {}

  /**
   * Sends an IPC event to the reader process to ADD the device with
   * the passed `deviceName`.
   */
  @action public async addDevice(deviceName: string) {
    const deviceInfoAndPort = await this.reader.addDevice(deviceName);
    if (!deviceInfoAndPort || !deviceInfoAndPort.info) return;

    const deviceProxy = new DeviceModelProxy(
      deviceInfoAndPort.info,
      deviceInfoAndPort.port
    );

    runInAction(() => this.deviceProxies.push(deviceProxy));

    const createdDevicePromise = new Promise((resolve) => {
      setTimeout(() => resolve(true), 300);
    });

    return createdDevicePromise;
  }

  /**
   * Sends an IPC event to the reader process to REMOVE the device with
   * the passed `deviceName`.
   */
  @action public async removeDevice(deviceName: string) {
    await this.reader.removeDevice(deviceName);

    // Remove the proxy device
    const removedDeviceIndex = this.deviceProxies.findIndex(
      (device) => device.name === deviceName
    );

    if (removedDeviceIndex === -1)
      throw new Error(
        'Could not remove the device proxy model. Something went wrong!'
      );

    this.deviceProxies[removedDeviceIndex].cleanup();
    runInAction(async () => {
      this.deviceProxies.splice(removedDeviceIndex, 1);
    });
  }

  /**
   * Removes all device proxies and devices from the device manager.
   */
  @action public async removeAllDevices() {
    this.deviceProxies.forEach((deviceProxy) => {
      deviceProxy.cleanup();
    });

    this.deviceProxies.length = 0;
    await this.reader.removeAllDevices();
  }

  /**
   * Updates the device settings in the reader process.
   */
  public async updateDeviceSettings(
    settings: DeviceSettingsType,
    deviceName: string
  ) {
    await this.reader.updateDeviceSettings(settings, deviceName);
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
      () => this.deviceProxies.length,
      async () => {
        const devices = await this.reader.getAllDeviceNames();
        runInAction(() => {
          this.availableDevices.length = 0;
          this.availableDevices.push(...devices);
        });
      }
    );

    this.reactions.push(activeDeviceReaction);
  }
}
