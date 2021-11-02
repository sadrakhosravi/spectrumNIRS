import { ipcMain, BrowserWindow, IpcMainEvent, app } from 'electron';

// Minimize window on minimize icon click
ipcMain.on('window:minimize', (event: IpcMainEvent) => {
  BrowserWindow.fromWebContents(event.sender)?.minimize();
});

// Close/quit window on minimize icon click
ipcMain.on('window:close', () => {
  app.quit();
});

// Restore window on minimize icon click
ipcMain.on('window:restore', (event: IpcMainEvent) => {
  const mainWindow = BrowserWindow.fromWebContents(event.sender);
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  mainWindow?.isMaximized() === true
    ? mainWindow.restore()
    : mainWindow?.maximize();
});

ipcMain.on('window:myexam', () => {
  console.log('messagee');
});

app.on('browser-window-created', () => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  mainWindow?.on('unmaximize', () => {
    console.log('Unmaximized');
    mainWindow?.webContents.send('window:unmaximize');
  });
  mainWindow?.on('maximize', () => {
    mainWindow?.webContents.send('window:maximize');
  });
});
