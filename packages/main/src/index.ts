import { app } from 'electron';
import './security-restrictions';
import { createMainWindow } from './mainWindow';
import { createReaderProcess } from './readerProcess';
import { IPCService } from './ipcService';

export type RendererWindows = {
  mainWindow: Electron.BrowserWindow | null;
  reader: Electron.BrowserWindow | null;
};

const renderers: RendererWindows = {
  mainWindow: null,
  reader: null,
};

/**
 * Prevent multiple instances
 */
//Test
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  app.quit();
});

/**
 * Create app window when background process will be ready
 */
app
  .whenReady()
  .then(createMainWindow)
  .then((mainWindow) => (renderers.mainWindow = mainWindow))
  .then(createReaderProcess)
  .then((reader) => (renderers.reader = reader))
  .then(() => new IPCService(renderers))
  .catch((e) => console.error('Failed create window:', e));

/**
 * Install dev extensions on dev mode only
 */
if (import.meta.env.DEV) {
  app
    .whenReady()
    .then(async () => {
      // const MobXDevTools = join(
      //   'C:/Users/sadra/AppData/Local/Google/Chrome/User Data/Default/Extensions/pfgnfdagidkfgccljigdamigbcnndkod/0.9.26_0',
      // );
      // const ReactDevTools = join(
      //   'C:/Users/sadra/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.24.3_0',
      // );
      // console.log(MobXDevTools);
      // await session.defaultSession.loadExtension(MobXDevTools);
      // await session.defaultSession.loadExtension(ReactDevTools);
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
