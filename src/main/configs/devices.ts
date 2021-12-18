// Devices
export const devices = [
  {
    id: 0,
    name: 'NIRS V5',
    samplingRate: 100,
    defaultIntensities: [180, 140, 140, 120, 120],
    intensities: [140, 140, 140, 120, 120],
    defaultGain: ['HIGH', '100'],
    channels: ['O2Hb', 'HHb', 'THb', 'TOI'],
    LEDs: ['LED1', 'LED2', 'LED3', 'LED4', 'LED5'],
    PreGain: ['LOW', 'HIGH', 'HIGHER'],
    driverName: 'STM32',
  },
  {
    id: 1,
    name: 'NIRS Beast',
    samplingRate: 100,
    defaultIntensities: [],
    intensities: [180, 140, 140, 120, 120],
    defaultGain: [],
    channels: ['O2Hb', 'HHb', 'THb', 'TOI'],
    LEDs: [''],
    PreGain: ['LOW', 'HIGH', 'HIGHER'],
    driverName: 'Unknown',
  },
];
