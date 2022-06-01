/*---------------------------------------------------------------------------------------------
 *  Device Manager View Model.
 *  Uses Mobx observable pattern.
 *  UI Logic for enabling and disabling devices.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, makeObservable, observable, reaction } from 'mobx';

// Services
import MainWinIPCService from '../../renderer/main-ui/MainWinIPCService';
import ServiceManager from '../../services/ServiceManager';

// Models
import { DeviceModelProxy } from '../../models/Device/DeviceModelProxy';

// Channels
import { DeviceChannels } from '../../utils/channels/DeviceChannels';

// Types
import type { DeviceNameType, DeviceInfoType } from '../../renderer/reader/api/Types';
import type { IReactionDisposer } from 'mobx';
import { ReaderChannels } from '../../utils/channels';
import { ipcRenderer } from 'electron';
import { chartVM } from '../VMStore';

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
  @observable private activeDevicesProxy: DeviceModelProxy[];
  /**
   * Observables reaction disposer array.
   */
  private reactions: IReactionDisposer[];
  /**
   * Recording start time stamp or 0.
   */
  private startTimestamp: number;
  private devicesMessagePort: DevicesMessagePortType[];

  constructor() {
    this.availableDevices = [];
    this.activeDevicesProxy = [];
    this.reactions = [];
    this.startTimestamp = 0;

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
    return this.activeDevicesProxy;
  }

  /**
   * The reader process recording state
   */
  public get isRecordingData() {
    return ServiceManager.store.deviceStore.store.isRecordingData;
  }

  /**
   * Does initial checks and adjustments for the recording start event.
   */
  public initRecordingStart() {
    this.startTimestamp = Date.now();

    // Set the start time stamp on each device.
    this.activeDevices.forEach((device) => device.start(this.startTimestamp));

    // Send the signal to the reader process.
    MainWinIPCService.sendToReader(ReaderChannels.START);

    chartVM.charts.forEach((chart) => chart.series[0].clearData());
    chartVM.handleRecordingStart();
    chartVM.charts[0].dashboardChart.chart.getDefaultAxisX().setInterval(0, 30_000);
  }

  /**
   * Stops the device proxy.
   */
  public stopRecording() {
    const stopTimestamp = Date.now();

    // Send the signal to the reader process.
    MainWinIPCService.sendToReader(ReaderChannels.STOP);

    // Set the start time stamp on each device.
    this.activeDevices.forEach((device) => device.stop(stopTimestamp));

    chartVM.handleRecordingStop();
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
    ipcRenderer.on('device:port', (event, name) => {
      const port = event.ports[0];

      if (!port)
        throw new Error('Port is missing from the event object. Something has gone wrong!');

      // Add it to the array.
      this.devicesMessagePort.push({ port, name });
    });

    // Request all active devices info on initialization.
    this.requestAllActiveDevices();
  }

  /**
   * Creates a device proxy model for the device that was created in the reader process.
   */
  @action private createDeviceProxy(deviceInfo: DeviceInfoType) {
    const portIndex = this.devicesMessagePort.findIndex(
      (devicePort) => devicePort.name === deviceInfo.name,
    );

    if (portIndex === -1) throw new Error('Device name and device port name mismatch!');

    const port = this.devicesMessagePort.splice(portIndex, 1)[0];

    const deviceModel = new DeviceModelProxy(deviceInfo, port.port);
    this.activeDevices.push(deviceModel);
  }

  /**
   * Handle observable reactions.
   */
  private handleReactions() {
    // Update active devices based on the global state
    const activeDeviceReactionDisposer = reaction(
      () => ServiceManager.store.deviceStore.store.activeDeviceModules,
      () => {
        const devices = ServiceManager.store.deviceStore.store.activeDeviceModules;
        devices.forEach((device) => {
          // Find the device
          const proxyDevice = this.activeDevices.find(
            (activeDevice) => activeDevice.name === device.name,
          );

          // If the device does not exist create it
          if (!proxyDevice) {
            this.createDeviceProxy(device);
          }
        });

        // Check for inactive device proxies
        this.activeDevices.forEach((activeDevice, index) => {
          const activeDeviceIndex = devices.findIndex(
            (device) => device.name === activeDevice.name,
          );

          // Device is not active anymore, remove the proxy
          if (activeDeviceIndex === -1) {
            this.activeDevices[index].cleanup();
            this.activeDevices.splice(index, 1);
          }
        });
      },
    );

    // Add reactions to the trackable array.
    this.reactions.push(activeDeviceReactionDisposer);
  }
}
