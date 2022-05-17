import { BrowserWindow } from 'electron';
import { URL } from 'url';

function createWindow() {
  const browserWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    webPreferences: {
      webgl: false,
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
    },
  });

  // Open dev tools in dev mode
  setTimeout(() => {
    browserWindow.webContents.openDevTools();
  }, 1000);

  /**
   * URL for reader process.
   * Vite dev server for development.
   * `file://../renderer/reader.html` for production and test
   */
  const pageUrl =
    import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL + 'reader.html'
      : new URL('../renderer/dist/reader.html', 'file://' + __dirname).toString();

  browserWindow.loadURL(pageUrl);

  return browserWindow;
}

/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
export const createReaderProcess = () => {
  const renderer = createWindow();
  return renderer;
};
