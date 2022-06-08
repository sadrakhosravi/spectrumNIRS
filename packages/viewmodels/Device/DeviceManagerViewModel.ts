/*---------------------------------------------------------------------------------------------
 *  Device Manager View Model.
 *  Uses Mobx observable pattern.
 *  UI Logic for enabling and disabling devices.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, makeObservable, observable, reaction, runInAction } from 'mobx';
import { ipcRenderer } from 'electron';
import { MessagePortChannels } from '../../utils/channels';
import * as Comlink from 'comlink';

// Services
import MainWinIPCService from '../../renderer/main-ui/MainWinIPCService';

// Models

// Channels
import { DeviceChannels } from '../../utils/channels/DeviceChannels';

// Types
import type { DeviceInfoType, DeviceNameType } from '../../renderer/reader/api/Types';
import type { IReactionDisposer } from 'mobx';
import type { DeviceManagerType } from '../../renderer/reader/models/DeviceManager';
import type { DeviceSettingsType } from '../../models/Device/DeviceModelProxy';

// View Models
import { chartVM } from '../VMStore';
import { DeviceModelProxy } from '../../models/Device/DeviceModelProxy';

export type DevicesMessagePortType = {
  port: MessagePort;
  name: string;
};

export class DeviceManagerViewModel {
  /**
   * Available devices.
   */
  @observable private availableDevices: DeviceNameType[];
  /**
   * Active devices proxy array.
   */
  @observable private activeDeviceProxies: DeviceModelProxy[];
  /**
   * Observables reaction disposer array.
   */
  private reactions: IReactionDisposer[];
  /**
   * Recording start time stamp or 0.
   */
  protected startTimestamp: number;
  private devicesMessagePort: DevicesMessagePortType[];
  protected reader!: Comlink.Remote<DeviceManagerType>;
  isRecordingData: boolean;

  constructor() {
    this.availableDevices = [];
    this.activeDeviceProxies = [];
    this.reactions = [];
    this.startTimestamp = 0;
    this.isRecordingData = false;
    this.devicesMessagePort = [];
    // States

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
    return this.activeDeviceProxies;
  }

  /**
   * Does initial checks and adjustments for the recording start event.
   */
  public async initRecordingStart() {
    this.startTimestamp = Date.now();

    // Set the start time stamp on each device.
    this.activeDevices.forEach((device) => device.start(this.startTimestamp));

    chartVM.charts.forEach((chart) => chart.series[0].clearData());
    chartVM.charts[0].dashboardChart.chart.getDefaultAxisX().setInterval(0, 30_000);

    await this.reader.startDevices();
  }

  /**
   * Stops the device proxy.
   */
  public async stopRecording() {
    const stopTimestamp = Date.now();
    console.log(stopTimestamp);

    await this.reader.stopDevices();

    // Set the start time stamp on each device.
    this.activeDevices.forEach((device) => device.stop(stopTimestamp));

    chartVM.handleRecordingStop();
  }

  /**
   * Sends an IPC event to the reader process to ADD the device with
   * the passed `deviceName`.
   */
  public async addDevice(deviceName: string) {
    const deviceInfoAndPort = await this.reader.addDevice(deviceName);
    if (!deviceInfoAndPort || !deviceInfoAndPort.info) return;

    const deviceProxy = this.createDeviceProxy(deviceInfoAndPort.info, deviceInfoAndPort.port);
    runInAction(() => this.activeDeviceProxies.push(deviceProxy));

    this.getAvailableDevices();
  }

  /**
   * Sends an IPC event to the reader process to REMOVE the device with
   * the passed `deviceName`.
   */
  @action public async removeDevice(deviceName: string) {
    await this.reader.removeDevice(deviceName);

    // Remove the proxy device
    const removedDeviceIndex = this.activeDeviceProxies.findIndex(
      (device) => device.name === deviceName,
    );

    if (removedDeviceIndex === -1)
      throw new Error('Could not remove the device proxy model. Something went wrong!');

    this.activeDeviceProxies[removedDeviceIndex].cleanup();
    runInAction(() => this.activeDeviceProxies.splice(removedDeviceIndex, 1));

    await this.getAvailableDevices();
  }

  /**
   * Updates the device settings in the reader process.
   */
  public async updateDeviceSettings(settings: DeviceSettingsType, deviceName: string) {
    await this.reader.updateDeviceSettings(settings, deviceName);
  }

  /**
   * @returns the device settings
   */
  public async getDeviceSettings(deviceName: string) {
    return await this.reader.getDeviceInfo(deviceName);
  }

  /**
   * Sends a request to the reader process to get all device names and status.
   */
  @action public async getAvailableDevices() {
    // Request all active devices info on initialization.
    const deviceNames = await this.reader.getAllDeviceNames();
    runInAction(() => (this.availableDevices = deviceNames));
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
  private async init() {
    ipcRenderer.on('device:port', (event, name) => {
      const port = event.ports[0];

      if (!port)
        throw new Error('Port is missing from the event object. Something has gone wrong!');

      // Add it to the array.
      this.devicesMessagePort.push({ port, name });
    });

    ipcRenderer.once('ports:reader', (event) => {
      const [port] = event.ports;
      this.reader = Comlink.wrap(port);
    });

    await ipcRenderer.invoke(MessagePortChannels.READER_RENDERER);
    await this.reader.init();

    // Request all active devices info on initialization.
    const deviceNames = await this.reader.getAllDeviceNames();
    this.availableDevices.push(...deviceNames);
  }

  /**
   * Creates a device proxy model for the device that was created in the reader process.
   */
  private createDeviceProxy(deviceInfo: DeviceInfoType, port: MessagePort) {
    return new DeviceModelProxy(deviceInfo, port);
  }

  /**
   * Handle observable reactions.
   */
  private handleReactions() {
    const activeDeviceReactionDisposer = reaction(
      () => this.activeDeviceProxies.length,
      () => {
        console.log(this.activeDeviceProxies.length);
      },
    );

    // Add reactions to the trackable array.
    this.reactions.push(activeDeviceReactionDisposer);
  }
}
