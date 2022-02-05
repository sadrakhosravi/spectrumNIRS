/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, nativeTheme, screen } from 'electron';
import 'reflect-metadata';
import { resolveHtmlPath } from './util';

// Import controllers
import startControllers from 'controllers';

// Define mainWindow
let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

// Force high performance gpu
app.commandLine.appendSwitch('--force_high_performance_gpu', 'true');
app.commandLine.appendSwitch('enable-unsafe-es3-apis');

// const isDevelopment =
//   process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

// // Load debugger if app is in development
// if (isDevelopment) {
//   require('electron-debug')();
// }

// Create the main window
const createMainWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  // Create a window that fills the screen's available work area.
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const { x, y } = primaryDisplay.bounds;

  // Disable menu for the entire application
  // Menu.setApplicationMenu(false)

  mainWindow = new BrowserWindow({
    minHeight: 800,
    minWidth: 1200,
    backgroundColor: '#1E1E1E',
    x,
    y,
    width,
    height,
    darkTheme: true,
    frame: false,
    titleBarStyle: 'hidden',
    transparent: true,
    titleBarOverlay: false,
    paintWhenInitiallyHidden: true,
    webPreferences: {
      nodeIntegrationInWorker: true,
      partition: 'persist:spectrum',
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      backgroundThrottling: false,
    },
    icon: getAssetPath('icon.png'),
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  // Unmaximize event
  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('window:unmaximize');
  });

  mainWindow.on('resized', () => {
    mainWindow?.webContents.send('window:resize');
  });

  // Maximize event
  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('window:maximize');
  });

  return mainWindow;
};

(async () => {
  // Set dark theme by default - Light theme will be added in the next versions
  nativeTheme.themeSource = 'dark';

  // Create main window
  await app.whenReady();
  createMainWindow();
  startControllers();

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
})();
