import path from 'path';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

// Interfaces
import type { IPhysicalDevice } from 'reader/Interfaces';
import type { DeviceInfoType } from 'reader/models/Types';

export class SyncPulsePhysicalDevice implements IPhysicalDevice {
  /**
   * The V5's spawned device instances.
   * There should always be one instance of the V5 running.
   */
  private syncPulseInstances: ChildProcessWithoutNullStreams[];

  constructor() {
    this.syncPulseInstances = [];
  }

  /**
   * @returns the name of the device - `V5/V4`.
   */
  public static getName(): 'Sync Pulse' {
    return 'Sync Pulse';
  }

  /**
   * @returns the device information object.
   */
  public getDeviceInfo(): DeviceInfoType {
    return {
      id: this.getDeviceSerialNumber(),
      name: SyncPulsePhysicalDevice.getName(),
      version: this.getVersion(),
      numOfLEDs: this.getSupportedLEDNum(),
      numOfPDs: this.getSupportedPDNum(),
      supportedSamplingRate: this.getSupportedSamplingRates(),
      defaultSamplingRate: this.getDefaultSamplingRate(),
      PDChannelNames: this.getPDChannelNames(),
      calculatedChannelNames: this.getCalculatedChannelNames(),
      hasProbeSettings: false,
    };
  }

  /**
   * @returns the maximum number of supported LEDs
   */
  public getSupportedLEDNum() {
    return 0;
  }

  /**
   * @returns the maximum supported number of PDs
   */
  public getSupportedPDNum() {
    return 0;
  }

  /**
   * @returns the current beast socket communication instance.
   */
  public getIO() {
    return this.syncPulseInstances[0] as ChildProcessWithoutNullStreams;
  }

  /**
   * @returns the beast connection instance or null of not connected.
   */
  public getClient() {
    return this.syncPulseInstances[0] as ChildProcessWithoutNullStreams;
  }

  /**
   * @returns a boolean if the beast has joined the Spectrum's IO server.
   */
  public getIsConnected() {
    return this.syncPulseInstances.length !== 0;
  }

  /**
   * @returns the current device communication plugin version.
   */
  public getVersion() {
    return '0.3.0';
  }

  /**
   * @returns the default sampling rate of the device.
   */
  public getDefaultSamplingRate() {
    return 1;
  }

  /**
   * @returns the device serial number.
   */
  public getDeviceSerialNumber() {
    return 'sync-pulse-ibl-zx1';
  }

  /**
   * @returns an array of all the supported sampling rates.
   */
  public getSupportedSamplingRates() {
    return [1];
  }

  /**
   * @returns the PD channel names.
   */
  public getPDChannelNames() {
    const channelNames = ['Sync Pulse'];
    return channelNames;
  }

  /**
   * @returns the calculated channel names.
   */
  public getCalculatedChannelNames() {
    return ['Sync Pulse'];
  }

  /**
   * @returns the current device communication instance.
   */
  public getDevice() {
    return this.syncPulseInstances[0] as ChildProcessWithoutNullStreams;
  }

  /**
   * Spawns the V5 device reader.
   */
  public spawnDevice() {
    // Kill each previous instance first if any exists
    this.syncPulseInstances.forEach((instance) => {
      instance.removeAllListeners();
      instance.kill();
    });

    // Spawn a new instance
    const readerPath =
      process.env.MODE === 'development'
        ? path.join(process.env.PWD as string, 'packages', 'drivers', 'syncpulse', 'ftdi-pulse.exe')
        : '';
    const spawnedDevice = spawn(readerPath);
    spawnedDevice.stdout.setEncoding('utf-8');

    this.syncPulseInstances.push(spawnedDevice);
    return spawnedDevice;
  }

  /**
   * Waits for device connection.
   */
  public waitForDevice(): Promise<boolean> {
    return new Promise((resolve) => {
      // Wait for V5 to load.

      return resolve(true);
    });
  }

  /**
   * Cleans up the listeners and the device instance.
   */
  public cleanup() {
    this.syncPulseInstances.forEach((instance) => {
      instance.removeAllListeners();
      instance.kill();
    });
    this.syncPulseInstances.length = 0;
  }
}
