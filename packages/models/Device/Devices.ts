import type { DeviceInfoType } from './DeviceModel';

/**
 * List of all the available devices.
 */
export const devices: DeviceInfoType[] = [
  {
    id: 'beast-v-1.0.0',
    name: 'Beast',
    numOfPDs: 7,
    numOfLEDs: 15,
    defaultCalibrationFactor: 1,
    samplingRate: 1000,
    activeLEDs: 1,
    activePDs: 1,
  },
];
