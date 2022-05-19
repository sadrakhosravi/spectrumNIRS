/*---------------------------------------------------------------------------------------------
 *  Device Manager Reader Process Model.
 *  Manages the devices and updates their settings for data recording.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { makeObservable, observable } from 'mobx';
import { ipcRenderer } from 'electron';

// IPC Channels
import { DeviceChannels } from '@utils/channels/DeviceChannels';

// Devices

export class DeviceManager {
  /**
   * All active device module instances singleton.
   * Any class should use this module instance for device communication.
   */
  @observable protected devices: any[];

  constructor() {
    this.devices = [];
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
   * Handles device addition
   */
  private handleDeviceAddition(_event: Electron.IpcRendererEvent, deviceName: string) {
    console.log(deviceName);
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
