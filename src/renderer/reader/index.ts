import * as Comlink from 'comlink';
import { ipcRenderer } from 'electron';

import DeviceManager from './models/DeviceManager';

// Create a message port and send it to the main window.
const messagePorts = new MessageChannel();
ipcRenderer.postMessage('reader:port', null, [messagePorts.port2]);

/**
 * Starts the reader process and load async modules.
 */
const startReaderProcess = async () => {
  // Initialize the service manager for database access first.
  const serviceManager = (await import('../../services/ServiceManager'))
    .default;
  await serviceManager.init();

  // Start the device manager.
  const deviceManager = new DeviceManager();

  // Expose the device manager as a Comlink object.
  Comlink.expose(deviceManager, messagePorts.port1);
};

startReaderProcess();
