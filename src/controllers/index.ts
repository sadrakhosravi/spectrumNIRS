import { BrowserWindow, ipcMain } from 'electron';

const startControllers = async () => {
  // Attach window events
  await import('./window');

  // Start global and main process stores
  await import('./store');

  // Run initial startup checks
  const startup = (await import('./startup')).default;
  await startup();

  // Load probe controller
  const probesController = import('./probes');

  // Load Experiment & Recording controllers
  const experimentController = import('./experiment');
  const recordingController = import('./recording');

  // Load dialog box listeners
  const dialogBoxController = import('./dialogBox');

  // Load Export server settings
  const exportServerController = import('./exportServer');

  // Load settings window listeners
  const settingsWindowController = import('./settingsWindow');

  // Load chart listeners
  const chartController = import('./chart');

  // Load DB listeners
  const dbFunctionController = import('./db');

  // Load other listeners
  const otherListenersController = import('./others');

  // Version issue - FIXME: Use the right version of USB detection compiled for electron
  // await import('./usbDetection');

  // Let UI know that main has finished loading
  let mainWindow = BrowserWindow.getAllWindows()[0];

  // Wait for all modules to load and inform the UI
  Promise.all([
    probesController,
    experimentController,
    recordingController,
    dialogBoxController,
    exportServerController,
    settingsWindowController,
    chartController,
    dbFunctionController,
    otherListenersController,
  ]).then(() => mainWindow.webContents.send('main-loaded'));

  ipcMain.on('is-main-loaded', (event) => event.sender.send('main-loaded'));
};

export default startControllers;
