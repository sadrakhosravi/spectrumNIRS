import { autoUpdater } from 'electron-updater';
import { BrowserWindow, ipcMain } from 'electron';
const log = require('electron-log');

// Channels
import { UpdaterChannels } from '@utils/channels';

const updater = async () => {
  // Disable default behavior
  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.autoDownload = false;

  autoUpdater.logger = log;
  log.info('App starting...');

  const focusedWindow = BrowserWindow.getFocusedWindow() as BrowserWindow;

  // Check for update on the first open
  autoUpdater.checkForUpdates();

  // Checking for update
  autoUpdater.on('checking-for-update', (info) => {
    log.info(info);
    focusedWindow.webContents.send('update-spectrum', info);
  });

  // Update available, send to UI
  autoUpdater.on('update-available', (info) => {
    log.info(info);

    focusedWindow.webContents.send(UpdaterChannels.UpdateAvailable, info);
  });

  // Update not available, send to UI
  autoUpdater.on('update-not-available', (info) => {
    log.info(info);

    focusedWindow.webContents.send('update-spectrum', info);
  });

  // Update error, send to UI
  autoUpdater.on('error', (err) => {
    log.info(err);

    focusedWindow.webContents.send('update-spectrum', err);
  });

  // Update download progress, send to UI
  autoUpdater.on('download-progress', (progressObj) => {
    log.info(progressObj);

    focusedWindow.webContents.send(
      UpdaterChannels.DownloadingUpdate,
      progressObj
    );
  });

  // Update downloaded, send to UI
  autoUpdater.on('update-downloaded', (info) => {
    log.info(info);
    focusedWindow.webContents.send(UpdaterChannels.UpdateDownloaded, info);
  });

  // Download update on command from the UI
  ipcMain.on(UpdaterChannels.DownloadUpdate, () => {
    autoUpdater.downloadUpdate();
  });

  // Install update on command from the UI
  ipcMain.on(UpdaterChannels.InstallUpdate, () => autoUpdater.quitAndInstall());
};

export default updater;
