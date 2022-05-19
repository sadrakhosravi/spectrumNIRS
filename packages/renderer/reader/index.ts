// Import Reader
const worker = new Worker(new URL('./Devices/Beast/BeastDeviceReader.ts', import.meta.url), {
  type: 'module',
});

worker.addEventListener('message', ({ data }: any) => {
  console.log(data);
});

// Import IPC service
// import './ReaderIPCService';

// Device Manager
import { DeviceManager } from './models/DeviceManager';

new DeviceManager();
