import { BrowserWindow } from 'electron';
import { getAssetPath, resolveHtmlPath } from '../util';

function createWindow() {
  const reader = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      sandbox: false,
      nodeIntegration: true,
      nodeIntegrationInSubFrames: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      //   preload: app.isPackaged
      //     ? path.join(__dirname, 'preload.js')
      //     : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  reader.loadURL(resolveHtmlPath('reader.html'));

  // Open dev tools on debug
  setTimeout(() => reader.webContents.openDevTools(), 1000);

  return reader;
}

/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
export const createReaderProcess = () => {
  const renderer = createWindow();
  return renderer;
};
