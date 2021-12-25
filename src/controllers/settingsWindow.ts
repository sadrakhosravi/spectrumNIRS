import path from 'path';
import { BrowserWindow, ipcMain } from 'electron';
import { resolveHtmlPath } from '../main/util';

const settingsWindow = async () => {
  const mainWindow = BrowserWindow.getAllWindows()[0];

  const settingsWindow = new BrowserWindow({
    minHeight: 300,
    minWidth: 500,
    darkTheme: true,
    frame: false,
    roundedCorners: true,
    autoHideMenuBar: true,
    parent: mainWindow,
    webPreferences: {
      partition: 'persist:spectrum',
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, '../main/preload.js'),
      backgroundThrottling: false,
    },
  });
  settingsWindow.on('ready-to-show', () => settingsWindow.show);

  const settingsWindowPath = resolveHtmlPath('settings.html');
  settingsWindow.loadURL(settingsWindowPath);

  return settingsWindow;
};

ipcMain.on('settings:window', async () => {
  await settingsWindow();
});
