import { ipcMain, BrowserWindow, BrowserView } from 'electron';
// import { AppStateChannels } from 'utils/channels';

ipcMain.on('applicationState:record', async (event: Electron.IpcMainEvent) => {
  const mainWindow = BrowserWindow.fromWebContents(event.sender);
  const view = new BrowserView();
  mainWindow?.setBrowserView(view);
  view.setAutoResize({
    width: true,
    height: true,
    horizontal: true,
    vertical: true,
  });
  const windowSize: any = mainWindow?.getBounds();
  view.setBounds({
    x: windowSize.x + 57.6,
    y: windowSize + 40,
    width: 600,
    height: 600,
  });
  view.webContents.loadURL('https://electronjs.org');
});
