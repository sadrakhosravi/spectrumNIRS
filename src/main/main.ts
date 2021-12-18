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
import createDBConnection from '../db/index';
// Import controllers
import '../controllers';
import { autoUpdater } from 'electron-updater';

export default class AppUpdater {
  constructor() {
    const log = require('electron-log');
    log.transports.file.level = 'debug';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// Define mainWindow
let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

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

  mainWindow = await new BrowserWindow({
    minHeight: 800,
    minWidth: 1200,
    backgroundColor: '#1E1E1E',
    x,
    y,
    width: width,
    height: height,
    darkTheme: true,
    frame: false,
    webPreferences: {
      nativeWindowOpen: false,
      sandbox: false,
      nodeIntegrationInWorker: true,
      partition: 'persist:spectrum',
      webgl: true,
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
      backgroundThrottling: false,
    },
    icon: getAssetPath('icon.png'),
  });
  mainWindow.setBackgroundColor('#1E1E1E');
  mainWindow.maximize();
  mainWindow.loadURL(resolveHtmlPath('index.html'));
  // mainWindow.loadURL('http://localhost:1212');

  // Unmaximize event
  mainWindow.on('unmaximize', () => {
    console.log('Maximized');
    mainWindow?.webContents.send('window:unmaximize');
  });

  mainWindow.on('resize', () => {
    mainWindow?.webContents.send('window:resize');
  });

  // Maximize event
  mainWindow.on('maximize', () => {
    console.log('Maximized');
    mainWindow?.webContents.send('window:maximize');
  });

  return mainWindow;
};

app.on('activate', async () => {
  if (!mainWindow) {
    createMainWindow();
  }
});

(async () => {
  createDBConnection();

  // Set dark theme by default - Light theme will be added in the next versions
  nativeTheme.themeSource = 'dark';

  // Create main window
  await app.whenReady();
  await createMainWindow();

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
})();
