/*---------------------------------------------------------------------------------------------
 *  Device Manager Reader Process Model.
 *  Manages the devices and updates their settings for data recording.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

// Service Manager
import * as Comlink from 'comlink';

// Models
import { DeviceModel } from './DeviceModel';
import RegisterDevices from './RegisterDevice';

// Devices
import { devices } from '../Devices/Devices';

// Types
import type { DeviceNameType } from '../api/Types';
import type { DeviceSettingsType } from '@models/Device/DeviceModelProxy';
import { DeviceReader } from './DeviceReader';
import { makeObservable, observable } from 'mobx';
import ServiceManager from '../../../services/ServiceManager';

export type DeviceManagerType = DeviceManager;

/**
 * The main device manager state handler, updates will be sent to the UI thread.
 */
export class DeviceManager {
  /**
   * A list of all the device names and their worker url.
   */
  public devices: typeof devices;
  /**
   * OBSERVABLE: Instances of all the active device workers.
   */
  @observable protected activeDevices: DeviceModel[];
  /**
   * OBSERVABLE: available device names and status.
   */
  @observable public availableDevices: DeviceNameType[];
  /**
   * The device reader class instance.
   */
  public deviceReader: DeviceReader;

  constructor() {
    this.devices = devices;
    this.activeDevices = [];
    this.availableDevices = [];
    this.deviceReader = new DeviceReader();

    makeObservable(this);
  }

  /**
   * Initializes the class and adds listeners.
   */
  public async init() {
    RegisterDevices.registerInDB();
  }

  /**
   * @returns the device info.
   */
  public getDeviceInfo(deviceName: string) {
    const device = this.activeDevices.find(
      (device) => device.name === deviceName
    );

    if (!device) return;

    return device.deviceInfo;
  }

  /**
   * Handles device addition
   */
  public async addDevice(deviceName: string) {
    // First check if the device is not already there.
    const isDeviceActive = this.activeDevices.find(
      (device) =>
        device.name.toLocaleLowerCase() === deviceName.toLocaleLowerCase()
    );

    // Device already exists
    if (isDeviceActive) return;

    // Find the list from the list.
    const device = this.devices.find(
      (device) =>
        device.name.toLocaleLowerCase() === deviceName.toLocaleLowerCase()
    );

    // Device was not found, this only happens if something went wrong.
    if (!device) return;

    const deviceInstance = new DeviceModel(
      device.id,
      device.name,
      device.createWorker
    );

    // Initialize the device
    await deviceInstance.init();
    this.activeDevices.push(deviceInstance);

    const port = deviceInstance.getDevicePort();
    console.log(port);
    return Comlink.transfer({ info: deviceInstance.deviceInfo, port }, [port]);
  }

  /**
   * Handles the device removal and device's module memory cleanup.
   */
  public async removeDevice(deviceName: string) {
    const deviceToRemoveIndex = this.activeDevices.findIndex(
      (device) => device.name === deviceName
    );

    // No device found, something has gone wrong here. There should be a device.
    if (deviceToRemoveIndex === -1) throw new Error('Device not found!');

    // Stop the device and remove it from the list
    await this.activeDevices[deviceToRemoveIndex].stopDevice();
    await this.activeDevices[deviceToRemoveIndex].removeDevice();
    this.activeDevices.splice(deviceToRemoveIndex, 1);
  }

  /**
   * Removes all devices from the reader process and the observables.
   */
  public async removeAllDevices() {
    this.activeDevices.forEach(async (device) => {
      await device.stopDevice();
      await device.removeDevice();
    });
    this.activeDevices.length = 0;
  }

  /**
   * Handles the start signal from the UI
   */
  public startDevices() {
    this.activeDevices.forEach((device) => device.startDevice());
    this.deviceReader.startDataAcquisition(this.activeDevices);

    ServiceManager.dbConnection.dbDeviceDataManager.start();
  }

  /**
   * Handles the stop signal from the UI.
   */
  public stopDevices() {
    this.deviceReader.stopDataAcquisitionLoop();
    this.activeDevices.forEach((device) => device.stopDevice());

    ServiceManager.dbConnection.dbDeviceDataManager.stop();
  }

  /**
   * Listens for device settings update changes from the UI thread.
   */
  public updateDeviceSettings(newSettings: DeviceSettingsType, name: string) {
    const device = this.activeDevices.find((device) => device.name === name);
    if (!device) return;

    device.updateSettings(newSettings);
  }

  /**
   * Gets the list of all available device module names and sends them to the main UI.
   */
  public getAllDeviceNames() {
    console.log('get all device names');
    const devicesInfo: DeviceNameType[] = devices.map((device) => {
      // Check if the device is active.
      const isDeviceActive = this.activeDevices.find(
        (d) => d.name === device.name
      );
      return { name: device.name, isActive: isDeviceActive ? true : false };
    });
    return devicesInfo;
  }
}

export default DeviceManager;
