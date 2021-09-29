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
import { app, BrowserWindow } from 'electron';
import { resolveHtmlPath } from './util';
import ipc from './IPC/index';

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (true || isDevelopment) {
  require('electron-debug')();
}

const createMainWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = await new BrowserWindow({
    minHeight: 800,
    minWidth: 1200,
    width: 1200,
    height: 800,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nativeWindowOpen: false,
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

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  if (!mainWindow) {
    createMainWindow();
  }
});

(async () => {
  await app.whenReady();
  await createMainWindow();
  ipc();
  const { sequelize } = require('./Database/models/index');

  //Check DB Connection
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection successful!');
    })
    .catch(() => {
      console.log('Error connecting');
    });

  //Sync Models
  sequelize
    .sync({ force: true })
    .then(() => {
      console.log('Sync Successful!');
    })
    .catch(() => {
      console.log('Error in creating tables');
    });
})();
