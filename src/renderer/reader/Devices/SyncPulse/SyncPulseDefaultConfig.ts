import { IDeviceConfig } from '../../Interfaces';

/**
 * The default V5 configuration.
 */
export const SyncPulseDefaultConfig: IDeviceConfig = {
  name: 'default',
  description: 'Default SyncPulse configuration',
  deviceId: 3,
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
