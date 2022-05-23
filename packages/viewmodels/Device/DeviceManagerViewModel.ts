/*---------------------------------------------------------------------------------------------
 *  Device Manager View Model.
 *  Uses Mobx observable pattern.
 *  UI Logic for enabling and disabling devices.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, makeObservable, observable, reaction } from 'mobx';

// Services
import MainWinIPCService from '../../renderer/main-ui/MainWinIPCService';

// Models
import { ipcRenderer } from 'electron';
import { DeviceModelProxy } from '../../models/Device/DeviceProxyModel';

// Channels
import { DeviceChannels } from '../../utils/channels/DeviceChannels';

// Types
import type { DeviceNameType, DeviceInfoType } from '../../renderer/reader/models/Types';
import type { IReactionDisposer } from 'mobx';

export class DeviceManagerViewModel {
  /**
   * Available devices.
   */
  @observable private availableDevices: DeviceNameType[];
  /**
   * Active devices proxy array.
   */
  @observable private activeDevicesProxy: DeviceModelProxy[];
  /**
   * Observables reaction disposer array.
   */
  private reactions: IReactionDisposer[];

  constructor() {
    this.availableDevices = [];
    this.activeDevicesProxy = [];
    this.reactions = [];
    makeObservable(this);

    this.init();
    this.handleReactions();
  }

  /**
   * A list of all available devices.
   */
  public get allDevices() {
    return this.availableDevices;
  }

  /**
   * @returns an array of active devices.
   */
  public get activeDevices() {
    return this.activeDevicesProxy;
  }

  /**
   * Sends an IPC event to the reader process to ADD the device with
   * the passed `deviceName`.
   */
  public sendAddDeviceRequestToReader(deviceName: string) {
    MainWinIPCService.sendToReader(DeviceChannels.DEVICE_ADD, deviceName);

    // Update device info
    this.requestAllDevicesInfo();
  }

  /**
   * Sends an IPC event to the reader process to REMOVE the device with
   * the passed `deviceName`.
   */
  public sendRemoveDeviceRequestToReader(deviceName: string) {
    MainWinIPCService.sendToReader(DeviceChannels.DEVICE_REMOVE, deviceName);

    // Update device info
    this.requestAllDevicesInfo();
  }

  /**
   * Sends a request to the reader process to get all device names and status.
   */
  public requestAllDevicesInfo() {
    MainWinIPCService.sendToReader(DeviceChannels.GET_ALL_DEVICE_NAMES);
  }

  /**
   * Sends a request to the reader process to get all active device infos.
   */
  public requestAllActiveDevices() {
    MainWinIPCService.sendToReader(DeviceChannels.GET_ALL_ACTIVE_DEVICES);
  }

  /**
   * Attaches the event listeners.
   */
  private init() {
    // Listen for device names
    ipcRenderer.on(DeviceChannels.ALL_DEVICE_NAMES, this.handleGetAllDeviceNames.bind(this));

    // Listen for device info (device created)
    ipcRenderer.on(DeviceChannels.DEVICE_INFO, this.handleDeviceInfo.bind(this));

    // Request all active devices info on initialization.
    this.requestAllActiveDevices();
  }

  /**
   * Creates a device proxy model for the device that was created in the reader process.
   */
  @action private handleDeviceInfo(_e: Electron.IpcRendererEvent, deviceInfo: DeviceInfoType) {
    console.log(deviceInfo);
    const deviceModel = new DeviceModelProxy(deviceInfo);
    this.activeDevices.push(deviceModel);
  }

  /**
   * Listens for all device names from the reader channel.
   */
  @action private handleGetAllDeviceNames(_e: Electron.IpcRendererEvent, data: DeviceNameType[]) {
    this.availableDevices = data;
  }

  /**
   * Handle observable reactions.
   */
  private handleReactions() {
    const deviceListUpdateDisposer = reaction(
      () => this.availableDevices,
      () => {
        // Check for available device status and delete proxy objects that are still active.
        this.availableDevices.forEach((device) => {
          const deviceIndex = this.activeDevices.findIndex(
            (activeDevice) => activeDevice.name === device.name,
          );

          // If the device is still available but is not active remove it from the list
          // and cleanup listeners.
          if (deviceIndex !== -1 && !device.isActive) {
            this.activeDevices[deviceIndex].cleanup();
            this.activeDevices.splice(deviceIndex, 1);
          }
        });
      },
    );

    // Add reactions to the trackable array.
    this.reactions.push(deviceListUpdateDisposer);
  }
}
