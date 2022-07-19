import { BrowserWindow } from 'electron';
import { getAssetPath, resolveHtmlPath } from '../util';
import MenuBuilder from '../menu';

// const installExtensions = async () => {
//   const installer = require('electron-devtools-installer');
//   const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
//   const extensions = ['REACT_DEVELOPER_TOOLS'];

//   return installer
//     .default(
//       extensions.map((name) => installer[name]),
//       forceDownload
//     )
//     .catch(console.log);
// };

const createWindow = () => {
  // if (isDebug) {
  //   setTimeout(() => installExtensions(), 1000);
  // }

  const mainWindow = new BrowserWindow({
    show: true,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#232323',
      symbolColor: '#F1F1F1',
      height: 35,
    },
    darkTheme: true,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
      sandbox: false,
      //   preload: app.isPackaged
      //     ? path.join(__dirname, 'preload.js')
      //     : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  mainWindow.show();

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open dev tools on debug
  if (process.env.NODE_ENV === 'development')
    setTimeout(() => mainWindow.webContents.openDevTools(), 1000);

  return mainWindow;
};

/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
export const createMainWindow = () => {
  const mainWindow = createWindow();
  return mainWindow;
};
