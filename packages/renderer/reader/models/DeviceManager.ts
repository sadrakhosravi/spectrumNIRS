/*---------------------------------------------------------------------------------------------
 *  Device Manager Reader Process Model.
 *  Manages the devices and updates their settings for data recording.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, makeObservable, observable } from 'mobx';
import { ipcRenderer } from 'electron';

// Models
import { DeviceModel } from './DeviceModel';

// IPC Channels
import { DeviceChannels } from '@utils/channels/DeviceChannels';

// Devices
import { devices } from '../Devices/Devices';
import { ReaderChannels } from '@utils/channels';

// Types
import type { DeviceNameType } from './Types';
import { DeviceReader } from './DeviceReader';

/**
 * The main device manager state handler, updates will be sent to the UI thread.
 */
export class DeviceManager {
  /**
   * A list of all the device names and their worker url.
   */
  private devices: typeof devices;
  /**
   * Instances of all the active device workers
   */
  @observable protected activeDevices: DeviceModel[];
  /**
   * The device reader class instance.
   */
  private deviceReader: DeviceReader;

  constructor() {
    this.devices = devices;
    this.activeDevices = [];
    this.deviceReader = new DeviceReader(this.activeDevices);
    makeObservable(this);

    this.init();
  }

  /**
   * Initializes the class and adds listeners.
   */
  private init() {
    // Listen for device addition
    ipcRenderer.on(DeviceChannels.DEVICE_ADD, this.handleDeviceAddition.bind(this));

    // Listen for device settings update
    ipcRenderer.on(
      DeviceChannels.DEVICE_SETTINGS_UPDATE,
      this.handleDeviceSettingsUpdate.bind(this),
    );

    // Listen for device removal
    ipcRenderer.on(DeviceChannels.DEVICE_REMOVE, this.handleDeviceRemoval.bind(this));

    // Listen for all device names.
    ipcRenderer.on(DeviceChannels.GET_ALL_DEVICE_NAMES, this.handleGetAlLDeviceNames.bind(this));

    // Listen for active update.
    ipcRenderer.on(DeviceChannels.GET_ALL_ACTIVE_DEVICES, this.handleGetActiveDevices.bind(this));

    // Listen for device start and start all devices.
    ipcRenderer.on(ReaderChannels.START, () =>
      this.activeDevices.forEach((device) => device.startDevice()),
    );
  }

  /**
   * Handles device addition
   */
  @action private handleDeviceAddition(_event: Electron.IpcRendererEvent, deviceName: string) {
    // First check if the device is not already there.
    const isDeviceActive = this.activeDevices.find(
      (device) => device.name.toLocaleLowerCase() === deviceName.toLocaleLowerCase(),
    );

    // Device already exists
    if (isDeviceActive) return;

    // Find the list from the list.
    const device = this.devices.find(
      (device) => device.name.toLocaleLowerCase() === deviceName.toLocaleLowerCase(),
    );

    // Device was not found, this only happens if something went wrong.
    if (!device) return;

    // Create the device worker.
    const deviceInstance = new DeviceModel(
      device.name,
      device.workerURL,
      this.deviceReader.dataGetter,
    );

    // Add it to the observables.
    this.activeDevices.push(deviceInstance);
  }

  /**
   * Listens for device settings update changes from the UI thread.
   */
  private handleDeviceSettingsUpdate(
    _event: Electron.IpcRendererEvent,
    name: string,
    newSettings: any,
  ) {
    const device = this.activeDevices.find((device) => device.name === name);
    if (!device) return;

    device.updateSettings(newSettings);
  }

  /**
   * Handles the IPC request for all active devices by returning them as device info.
   */
  private handleGetActiveDevices() {
    this.activeDevices.forEach((device) => {
      device.sendDeviceInfo();
    });
  }

  /**
   * Handles the device removal and device's module memory cleanup.
   */
  private handleDeviceRemoval(_event: Electron.IpcRendererEvent, deviceName: string) {
    const deviceToRemoveIndex = this.activeDevices.findIndex(
      (device) => device.name === deviceName,
    );

    // No device found, something has gone wrong here. There should be a device.
    if (deviceToRemoveIndex === -1) throw new Error('Device not found!');

    // Stop the device and remove it from the list
    this.activeDevices[deviceToRemoveIndex].stopDevice();
    this.activeDevices.splice(deviceToRemoveIndex, 1);
  }

  /**
   * Gets the list of all available device module names and sends them to the main UI.
   */
  private handleGetAlLDeviceNames(event: Electron.IpcRendererEvent) {
    const devicesInfo: DeviceNameType[] = devices.map((device) => {
      // Check if the device is active.
      const isDeviceActive = this.activeDevices.find((d) => d.name === device.name);
      return { name: device.name, isActive: isDeviceActive ? true : false };
    });

    ipcRenderer.sendTo(event.senderId, DeviceChannels.ALL_DEVICE_NAMES, devicesInfo);
  }
}
