'use strict';
// require('v8-compile-cache');
const { app, BrowserWindow, ipcMain, webContents } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
const createMainWindow = async () => {
  // Create the browser window.
  const mainWin = new BrowserWindow({
    minHeight: 800,
    minWidth: 1200,
    width: 1200,
    height: 800,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWin.setBackgroundColor('#1E1E1E');
  //Load React inside Electron.
  // await mainWin.loadURL(`file://${path.join(__dirname, '../../build/index.html')}`);
  await mainWin.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`,
  );

  //Default app state is maximized
  mainWin.maximize();
  isDev && mainWin.webContents.openDevTools(); //For dev environment only

  return mainWin;
};

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  if (!mainWindow) {
    mainWindow = await createMainWindow();
  }
});

(async () => {
  await app.whenReady();
  mainWindow = await createMainWindow();
  //IPC Main Process
  const ipc = require('./IPC');
  ipc();
})();
