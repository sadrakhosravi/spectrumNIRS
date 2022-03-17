import { BrowserWindow, screen, app } from 'electron';
import path from 'path';
import { resolveHtmlPath } from '@electron/util';

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

interface IBrowserWindow extends BrowserWindow {
  windowId: string;
}

class WindowManger {
  mainWindow: null | IBrowserWindow;
  dbWindow: null | IBrowserWindow;
  constructor() {
    this.mainWindow = null;
    this.dbWindow = null;
  }

  /**
   * Initializes window manager and creates windows on startup
   */
  public init() {
    this.dbWindow = this.createDbWindow();
    this.mainWindow = this.createMainWindow();
  }

  /**
   * Creates the app's main window and attaches its listeners
   * @returns the main window object
   */
  private createMainWindow() {
    // Create a window that fills the screen's available work area.
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    const { x, y } = primaryDisplay.bounds;

    // Disable menu for the entire application
    // Menu.setApplicationMenu(false)

    const mainWindow = new BrowserWindow({
      minHeight: 800,
      minWidth: 1000,
      backgroundColor: '#1E1E1E',
      x,
      y,
      width,
      height,
      darkTheme: true,
      frame: false,
      webPreferences: {
        partition: 'persist:spectrum',
        contextIsolation: false,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        preload: path.join(__dirname, 'preload.js'),
        backgroundThrottling: false,
      },
      icon: getAssetPath('icon.png'),
    }) as IBrowserWindow;

    mainWindow.windowId = 'mainWindow'; // Used to filter windows

    // Unmaximize event
    mainWindow.on('unmaximize', () => {
      mainWindow?.webContents.send('window:unmaximize');
    });

    mainWindow.on('resized', () => {
      mainWindow?.webContents.send('window:resize');
    });

    // Maximize event
    mainWindow.on('maximize', () => {
      mainWindow?.webContents.send('window:maximize');
    });

    // Quit the app on main window close
    mainWindow.on('close', () => {
      app.quit();
    });

    mainWindow.loadURL(resolveHtmlPath('startup.html'));
    mainWindow.loadURL(resolveHtmlPath('index.html'));

    return mainWindow;
  }

  /**
   * Creates the hidden db window (db process - refer to electron app architecture for more info)
   * The hidden window acts as a separate process
   * @returns the main window object
   */
  private createDbWindow() {
    const dbWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        partition: 'persist:spectrum',
        contextIsolation: false,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        backgroundThrottling: false,
        preload: path.join(__dirname, 'preload.js'),
      },
      icon: getAssetPath('icon.png'),
    }) as IBrowserWindow;

    dbWindow.windowId = 'dbWindow'; // Used to filter windows
    dbWindow.loadURL(resolveHtmlPath('db.html'));

    return dbWindow;
  }
}

export default new WindowManger();
