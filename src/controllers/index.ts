import { BrowserWindow, ipcMain } from 'electron';

// Controllers
import startup from './startup';

const startControllers = async () => {
  await import('./store');
  await startup();
  await import('./db');
  await import('./probes');
  await import('./chart');
  await import('./window');
  await import('./experiment');
  await import('./recording');
  await import('./dialogBox');
  await import('./settingsWindow');
  await import('./usbDetection');
  await import('./others');
  await import('./reviewTab');
  await import('./exportServer');

  // Let UI know that main has finished loading
  const mainWindow = BrowserWindow.getAllWindows()[0];
  mainWindow.webContents.send('main-loaded');
  ipcMain.on('is-main-loaded', (event) => event.sender.send('main-loaded'));
};

export default startControllers;
