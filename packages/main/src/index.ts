import { app } from 'electron';
import './security-restrictions';
import { startup } from './Startup/startup';

// Windows
import { createMainWindow } from './mainWindow';
import { createReaderProcess } from './readerProcess';

// Services
import { IPCService } from './ipcService';
import { GlobalStore } from './GlobalStore';

import { RegisterGlobalShortcuts } from './Menu/RegisterGlobalShortcuts';

// Expose the garbage collector
// Only should be used in edge cases by calling global.gc()
// Used in reader process to avoid large data buildup before collection.
require('v8').setFlagsFromString('--expose_gc');
global.gc = require('vm').runInNewContext('gc');
app.commandLine.appendSwitch('js-flags', '--expose_gc');

export type RendererWindows = {
  mainWindow: Electron.BrowserWindow | null;
  reader: Electron.BrowserWindow | null;
};

export const renderers: RendererWindows = {
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

(async () => {
  await app.whenReady();

  // Await folder checks
  await startup();

  new RegisterGlobalShortcuts();
  new GlobalStore();

  const mainWindow = createMainWindow();
  renderers.mainWindow = mainWindow;

  const readerProcess = createReaderProcess();
  renderers.reader = readerProcess;

  // Start the IPC service
  new IPCService(renderers);
})();

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
