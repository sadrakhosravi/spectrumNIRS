import { IDeviceConfig } from 'reader/Interfaces';

/**
 * The default V5 configuration.
 */
export const V5DefaultConfig: IDeviceConfig = {
  name: 'default',
  description: 'Default V5 configuration',
  deviceId: 2,
  settings: {
    samplingRate: 100,
    LEDIntensities: [130, 120, 130, 120, 170],
    activePDs: [true],
    activeLEDs: [true, true, true, true, true],
    deviceCalibrationFactor: 1,
    deviceGain: 0,
    devicePreGain: 'HIGH',
    softwareGain: 1,
  },
};
