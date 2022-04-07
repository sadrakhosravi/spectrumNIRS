import { app, session } from 'electron';
import './security-restrictions';
import { restoreOrCreateWindow } from '/@/mainWindow';
import { join } from 'path';

/**
 * Prevent multiple instances
 */
//Test
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);

/**
 * Disable Hardware Acceleration for more power-save
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', restoreOrCreateWindow);

/**
 * Create app window when background process will be ready
 */
app
  .whenReady()
  .then(restoreOrCreateWindow)
  .catch((e) => console.error('Failed create window:', e));

/**
 * Install dev extensions on dev mode only
 */
if (import.meta.env.DEV) {
  app
    .whenReady()
    .then(async () => {
      const MobXDevTools = join(
        'C:/Users/sadra/AppData/Local/Google/Chrome/User Data/Default/Extensions/pfgnfdagidkfgccljigdamigbcnndkod/0.9.26_0',
      );
      const ReactDevTools = join(
        'C:/Users/sadra/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.24.3_0',
      );

      console.log(MobXDevTools);
      await session.defaultSession.loadExtension(MobXDevTools);
      await session.defaultSession.loadExtension(ReactDevTools);
    })
    .catch((e) => console.log('Failed to load the extension: ' + e));
}

/**
 * Check new app version in production mode only
 */
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error('Failed check updates:', e));
}

/**
 * Load Developer Extensions
 */
