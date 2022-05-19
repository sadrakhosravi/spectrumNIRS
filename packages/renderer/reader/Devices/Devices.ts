/**
 * All devices of the application with their name and worker url.
 * Newly added devices should be added here.
 */
export const devices = [
  { name: 'Beast', workerURL: new URL('./Beast/BeastDeviceReader.ts', import.meta.url) },
];
