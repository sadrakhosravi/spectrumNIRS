// Import services
import ServiceManager from '../../services/ServiceManager';

// Import IPC service
import './ReaderIPCService';

// Device Manager
import { DeviceManager } from './models/DeviceManager';

// Initialize the device manager after 1 second to ensure the main UI is loaded first
setTimeout(() => {
  new DeviceManager();
}, 1000);

// Before process reload, empty the state,
window.onbeforeunload = () => {
  ServiceManager.store.deviceStore.setDeviceStoreValue('activeDeviceModules', []);
  ServiceManager.store.deviceStore.setDeviceStoreValue('allDeviceNamesAndInfo', []);
};
