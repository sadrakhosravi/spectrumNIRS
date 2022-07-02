import path from 'path';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

// Interfaces
import type { INIRSDevice } from 'reader/Interfaces';
import type { DeviceInfoType } from 'reader/api/Types';

export class V5PhysicalDevice implements INIRSDevice {
  /**
   * The V5's spawned device instances.
   * There should always be one instance of the V5 running.
   */
  private V5Instances: ChildProcessWithoutNullStreams[];

  constructor() {
    this.V5Instances = [];
  }

  /**
   * @returns the name of the device - `V5/V4`.
   */
  public static getName(): 'V5/V4' {
    return 'V5/V4';
  }

  /**
   * @returns the device information object.
   */
  public getDeviceInfo(): DeviceInfoType {
    return {
      id: this.getDeviceSerialNumber(),
      name: V5PhysicalDevice.getName(),
      version: this.getVersion(),
      ADCRes: this.getADCResolution(),
      DACRes: this.getDACResolution(),
      numOfChannelsPerPD: this.getSupportedLEDNum() + 1, // +1 for ambient
      numOfADCs: this.getSupportedPDNum(),
      supportedSamplingRate: this.getSupportedSamplingRates(),
      defaultSamplingRate: this.getDefaultSamplingRate(),
      PDChannelNames: this.getPDChannelNames(),
      calculatedChannelNames: this.getCalculatedChannelNames(),
      hasProbeSettings: true,
    };
  }

  /**
   * @returns the ADC resolution taking the reserved bits into account.
   */
  public getADCResolution(): number {
    return 12; // 12 bits ADC.
  }

  /**
   * @returns the LED DAC driver.
   */
  public getDACResolution(): number {
    return 8; // 8 bits DAC led intensity driver.
  }

  /**
   * @returns the maximum number of supported LEDs
   */
  public getSupportedLEDNum() {
    return 5;
  }

  /**
   * @returns the maximum supported number of PDs
   */
  public getSupportedPDNum() {
    return 1;
  }

  /**
   * @returns the current beast socket communication instance.
   */
  public getIO() {
    return this.V5Instances[0] as ChildProcessWithoutNullStreams;
  }

  /**
   * @returns the beast connection instance or null of not connected.
   */
  public getClient() {
    return this.V5Instances[0] as ChildProcessWithoutNullStreams;
  }

  /**
   * @returns a boolean if the beast has joined the Spectrum's IO server.
   */
  public getIsConnected() {
    return this.V5Instances.length !== 0;
  }

  /**
   * @returns the current device communication plugin version.
   */
  public getVersion() {
    return '0.5.0';
  }

  /**
   * @returns the default sampling rate of the device.
   */
  public getDefaultSamplingRate() {
    return 100;
  }

  /**
   * @returns the device serial number.
   */
  public getDeviceSerialNumber() {
    return 'v5-ibl-zx1';
  }

  /**
   * @returns an array of all the supported sampling rates.
   */
  public getSupportedSamplingRates() {
    return [100, 50, 25, 20, 10, 5, 2, 1];
  }

  /**
   * @returns the PD channel names.
   */
  public getPDChannelNames() {
    const channelNames = ['Ambient'];
    for (let i = 0; i < this.getSupportedLEDNum(); i++) channelNames.push(`LED${i + 1}`);
    return channelNames;
  }

  /**
   * @returns the calculated channel names.
   */
  public getCalculatedChannelNames() {
    return ['O2Hb', 'HHb', 'THb', 'TOI'];
  }

  /**
   * @returns the current device communication instance.
   */
  public getDevice() {
    return this.V5Instances[0] as ChildProcessWithoutNullStreams;
  }

  /**
   * Spawns the V5 device reader.
   */
  public spawnDevice() {
    // Kill each previous instance first if any exists
    this.V5Instances.forEach((instance) => {
      instance.removeAllListeners();
      instance.kill();
    });

    // Spawn a new instance
    const readerPath =
      process.env.MODE === 'development'
        ? path.join(process.env.PWD as string, 'packages', 'drivers', 'v5', 'reader.exe')
        : '';
    const spawnedDevice = spawn(readerPath);
    spawnedDevice.stdout.setEncoding('utf-8');

    this.V5Instances.push(spawnedDevice);
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
    this.V5Instances.forEach((instance) => {
      instance.removeAllListeners();
      instance.kill();
    });
    this.V5Instances.length = 0;
  }
}
