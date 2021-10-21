import { ipcMain, BrowserWindow, BrowserView, IpcMainEvent } from 'electron';
import path from 'path';
import url from 'url';

// import { AppStateChannels } from 'utils/channels';

ipcMain.on('applicationState:record', async (event: Electron.IpcMainEvent) => {
  const mainWindow = BrowserWindow.fromWebContents(event.sender);

  // BrowserView creation
  const view = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'tabPreload.js'),
    },
  });

  // Load the Browser View inside of the mainWindow
  mainWindow?.setBrowserView(view);
  view.setAutoResize({
    width: true,
    height: true,
  });

  // Determine the size of the BrowserView
  const mainWindowSize: any = mainWindow?.getBounds();
  const tabWidth = mainWindowSize.width - 58;
  const tabHeight = mainWindowSize.height - 126;

  // Set the size of the BrowserView
  view.setBounds({
    x: 60,
    y: 80,
    width: tabWidth,
    height: tabHeight,
  });

  // Show dev tools
  view.webContents.openDevTools();

  // Load url
  const urlToLoad = url.format({
    pathname: '//localhost:1212/index.html',
    hash: '/tabs/recording/record',
    protocol: 'http',
  });
  console.log(urlToLoad);

  view.webContents.loadURL(urlToLoad);
});

ipcMain.on('applicationState:home', (event: IpcMainEvent) => {
  BrowserWindow.fromWebContents(event.sender)?.setBrowserView(null);
});
