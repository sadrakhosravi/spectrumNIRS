/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, nativeTheme, screen } from 'electron';
import { resolveHtmlPath } from './util';
import ipc from '@ipc/index';
const { sequelize } = require('../db/models/index');

// import ipc from '@ipc/index';

// Define mainWindow
let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

// Load debugger if app is in development
if (isDevelopment) {
  require('electron-debug')();
}

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

  mainWindow = await new BrowserWindow({
    minHeight: 800,
    minWidth: 1200,
    width: width,
    height: height,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: getAssetPath('icon.png'),
  });

  mainWindow.setBackgroundColor('#1E1E1E');
  mainWindow.webContents.openDevTools();

  await mainWindow.loadURL(resolveHtmlPath('index.html'));

  // Default app state is maximized
  mainWindow.maximize();

  return mainWindow;
};

app.on('activate', async () => {
  if (!mainWindow) {
    createMainWindow();
  }
});

(async () => {
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

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ force: true });
    console.log('Sync Successful');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  // Attach IPC listeners
  ipc();
})();
