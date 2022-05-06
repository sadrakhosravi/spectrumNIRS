import type { DeviceInfoType } from './DeviceMode';

/**
 * List of all the available devices.
 */
export const devices: DeviceInfoType[] = [
  {
    name: 'Beast',
    numOfPDs: 7,
    numOfLEDs: 15,
    defaultCalibrationFactor: 1,
    activeLEDs: 1,
    activePDs: 1,
  },
];
