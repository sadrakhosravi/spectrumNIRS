/**
 * Interface for each Spectrum device plugin configuration.
 */
export interface IDeviceConfig {
  name: string;
  description: string | null;
  settings: IDeviceConfigParsed;
  deviceId: number;
}

/**
 * Device configuration parsed from `JSON.stringified` version.
 */
export interface IDeviceConfigParsed {
  samplingRate: number;
  activePDs: boolean[];
  activeLEDs: boolean[];
  LEDIntensities: number[];
  deviceCalibrationFactor: number;
  deviceGain: number;
  devicePreGain: string | number;
  softwareGain: number;
}
