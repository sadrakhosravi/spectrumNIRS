/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app } from 'electron';
import { isDebug } from './util';

import { MessagePortManager } from './models/MessagePortManager';

// Renderer processes
import { createMainWindow } from './renderers/mainWindow';
// import { createReaderProcess } from './renderers/reader';
import { startup } from './startup/startup';
// import { createReaderProcess } from './renderers/reader';

export type RendererWindows = {
  mainWindow: Electron.BrowserWindow | null;
  reader: Electron.BrowserWindow | null;
};

// Keep track of all the renderers
export const renderers: RendererWindows = {
  mainWindow: null,
  reader: null,
};

// Expose the garbage collector
// Only should be used in edge cases by calling global.gc()
// Used in reader process to avoid large data buildup before collection.
require('v8').setFlagsFromString('--expose_gc');

global.gc = require('vm').runInNewContext('gc');
app.commandLine.appendSwitch('js-flags', '--expose_gc');

// Open chrome's remote debugging.
if (isDebug) app.commandLine.appendSwitch('remote-debugging-port', '1919');

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Run the application
(async () => {
  await app.whenReady();

  // Await folder checks
  await startup();

  // Create the manager models
  new MessagePortManager(renderers);

  // Import IPC events
  await import('./models/DialogBox');

  // Create renderers
  // renderers.reader = createReaderProcess();
  renderers.mainWindow = createMainWindow();
})();
