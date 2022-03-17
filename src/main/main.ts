/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
process.env.TZ = 'America/Vancouver';

import { app, nativeTheme } from 'electron';
import 'reflect-metadata';

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

// Force high performance gpu
app.commandLine.appendSwitch('--force_high_performance_gpu');
app.commandLine.appendSwitch('js-flags', '--expose_gc');

(async () => {
  // Set dark theme by default - Light theme will be added in the next versions
  nativeTheme.themeSource = 'dark';

  // Create main window
  await app.whenReady();

  // Create windows
  const WindowManager = (await import('./WindowManager')).default;
  WindowManager.init();

  // Start controllers
  const startControllers = (await import('../controllers/index')).default;
  startControllers();
})();

// Close database connection on app quit
process.on('exit', async () => {
  const tyeporm = require('typeorm');
  await tyeporm.getConnection().close();
  console.log('Quit done');
});
