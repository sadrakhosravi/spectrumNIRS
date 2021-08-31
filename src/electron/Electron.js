const { app, BrowserWindow, ipcMain, webContents } = require('electron');
const path = require('path');

const isDev = require('electron-is-dev');

//Require Worker Threads
const WorkerThreads = require('./WorkerThreads');

let mainWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
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

  mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`,
  );
  mainWindow.maximize();
  mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

//NEEDS TO BE REFACTORED TO A SEPERATE FILE

//Minimze window on minimize icon click
ipcMain.on('window:minimize', () => {
  mainWindow.minimize();
  WorkerThreads(mainWindow);
});

//Close/quit window on minimize icon click
ipcMain.on('window:close', () => {
  app.quit();
});

//Restore window on minimize icon click
ipcMain.on('window:restore', () => {
  mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
});

module.exports = createWindow;
