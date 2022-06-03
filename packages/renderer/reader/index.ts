import * as Comlink from 'comlink';

// Import services
import ServiceManager from '../../services/ServiceManager';

// Import IPC service
import './ReaderIPCService';

// Device Manager
import { DeviceManager } from './models/DeviceManager';
import { ipcRenderer } from 'electron';

// Initialize the device manager after 1 second to ensure the main UI is loaded first
setTimeout(() => {
  const deviceManager = new DeviceManager();

  // Create a message port and send it to the main window.
  const messagePorts = new MessageChannel();
  ipcRenderer.postMessage('window:port', 'reader', [messagePorts.port2]);

  Comlink.expose(deviceManager, messagePorts.port1);
}, 100);

// Before process reload, empty the state,
window.onbeforeunload = () => {
  ServiceManager.store.deviceStore.setDeviceStoreValue('activeDeviceModules', []);
  ServiceManager.store.deviceStore.setDeviceStoreValue('allDeviceNamesAndInfo', []);
};
