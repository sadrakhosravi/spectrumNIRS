import * as Comlink from 'comlink';

import { ipcRenderer } from 'electron';

/**
 * Starts the reader process and load async modules.
 */
const startReaderProcess = async () => {
  // Initialize the service manager for database access first.
  const serviceManager = (await import('../../services/ServiceManager')).default;
  await serviceManager.init();

  setTimeout(async () => {
    // Device Manager
    const DeviceManager = (await import('./models/DeviceManager')).default;

    // Start the device manager.
    const deviceManager = new DeviceManager();

    // Create a message port and send it to the main window.
    const messagePorts = new MessageChannel();
    ipcRenderer.postMessage('window:port', 'reader', [messagePorts.port2]);

    // Expose the device manager as a Comlink object.
    Comlink.expose(deviceManager, messagePorts.port1);
  }, 100);
};

startReaderProcess();
