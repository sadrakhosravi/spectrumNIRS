/**
 * All devices of the application with their name and worker url.
 * Newly added devices should be added here.
 */
export const devices = [
  { id: 1, name: 'Beast', workerURL: new URL('./Beast/BeastDeviceReader.ts', import.meta.url) },
  { id: 2, name: 'V5/V4', workerURL: new URL('./V5/V5DeviceReader.ts', import.meta.url) },
  {
    id: 3,
    name: 'Sync Pulse',
    workerURL: new URL('./SyncPulse/SyncPulseDeviceReader.ts', import.meta.url),
  },
];
