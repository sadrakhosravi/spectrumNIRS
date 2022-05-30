import { app, BrowserWindow, ipcMain } from 'electron';
import { URL } from 'url';

function createWindow() {
  const browserWindow = new BrowserWindow({
    show: true, // Use 'ready-to-show' event to show window
    titleBarStyle: 'hidden',
    minHeight: 600,
    minWidth: 800,
    height: 600,
    width: 800,
    titleBarOverlay: {
      color: '#232323',
      symbolColor: '#F1F1F1',
      height: 35,
    },
    frame: false,
    darkTheme: true,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
      enableBlinkFeatures: '',

      webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
      // preload: join(__dirname, '../../preload/dist/index.cjs'),
    },
  });

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  browserWindow.on('ready-to-show', () => {
    browserWindow?.maximize();
    browserWindow?.show();
    browserWindow.focus();
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl =
    import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL + 'index.html'
      : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();

  browserWindow.loadURL(pageUrl);

  return browserWindow;
}

let count = 0;

/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
export function createMainWindow() {
  const window = createWindow();
  window.on('close', () => app.quit());

  if (import.meta.env.DEV) {
    ipcMain.handle('open-dev-tools', () => {
      count === 0 && true;
      count = 2;
    });
  }

  return window;
}
