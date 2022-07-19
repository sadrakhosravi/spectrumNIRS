/**
 * All devices of the application with their name and worker url.
 * Newly added devices should be added here.
 */
export const devices = [
  {
    id: 1,
    name: 'Beast',
    //@ts-ignore
    createWorker: () =>
      new Worker(
        //@ts-ignore
        new URL('./Modules/Beast/BeastDeviceReader.ts', import.meta.url),
        {
          type: 'module',
        }
      ),
  },
  {
    id: 2,
    name: 'V5/V4',
    //@ts-ignore
    createWorker: () =>
      //@ts-ignore
      new Worker(new URL('./Modules/V5/V5DeviceReader.ts', import.meta.url), {
        type: 'module',
      }),
  },
  {
    id: 3,
    name: 'Sync Pulse',
    //@ts-ignore
    createWorker: () =>
      new Worker(
        new URL(
          './Modules/SyncPulse/SyncPulseDeviceReader.ts',
          //@ts-ignore
          import.meta.url
        ),
        {
          type: 'module',
        }
      ),
  },
];
