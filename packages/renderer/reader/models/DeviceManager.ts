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

/**
 * The main device manager state handler, updates will be sent to the UI thread automatically.
 */
export class DeviceManager {
  /**
   * A list of all the device names and their worker url.
   */
  protected devices: typeof devices;
  /**
   * Instances of all the active device workers
   */
  @observable protected activeDevices: DeviceModel[];

  constructor() {
    this.devices = devices;
    this.activeDevices = [];
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
    ipcRenderer.on(DeviceChannels.DEVICE_UPDATE, this.handleDeviceSettingsUpdate.bind(this));

    // Listen for device removal
    ipcRenderer.on(DeviceChannels.DEVICE_REMOVE, this.handleDeviceRemoval.bind(this));

    // Listen for all device names.
    ipcRenderer.on(DeviceChannels.ALL_DEVICE_NAME, this.handleGetAlLDeviceNames.bind(this));
  }

  /**
   * The data getter function sent to the device model to pass the data to this class.
   */
  public dataGetter = (data: any) => {
    console.log(data);
  };

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
    const deviceInstance = new DeviceModel(device.name, device.workerURL, this.dataGetter);

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
    console.log(name, newSettings);
  }

  /**
   * Handles the device removal and device's module memory cleanup.
   */
  private handleDeviceRemoval(_event: Electron.IpcRendererEvent, deviceName: string) {
    console.log(deviceName);
  }

  /**
   * Gets the list of all available device module names and sends them to the main UI.
   */
  private handleGetAlLDeviceNames(event: Electron.IpcRendererEvent) {
    const devices = ['Beast', 'V5', 'SyncPulse'];
    ipcRenderer.sendTo(event.senderId, DeviceChannels.ALL_DEVICE_NAME, devices);
  }
}
