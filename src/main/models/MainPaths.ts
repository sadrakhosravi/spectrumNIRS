import { app } from 'electron';
import path from 'path';
import { ipcMain } from 'electron';

// Channels
import { PathChannels } from '../../utils/channels';

export class MainPaths {
  private appName: string;
  private storePath: string;
  private dbPath: string;
  private dbFile: string;

  constructor() {
    this.appName = 'Spectrum';
    this.storePath = path.resolve(
      app.getPath('appData'),
      this.appName,
      'Settings',
      'Global'
    );
    this.dbPath = path.resolve(
      app.getPath('appData'),
      this.appName,
      'Database'
    );
    this.dbFile = path.resolve(this.dbPath, 'spectrum.db');
    this.listenForPathIPCRequests();
  }

  /**
   * @returns the path of the global store.
   */
  public get globalStorePath() {
    return this.storePath;
  }

  /**
   * The database folder path.
   */
  public get dbFolderPath() {
    return this.dbPath;
  }

  /**
   * The database file path.
   */
  public get dbFilePath() {
    return this.dbFile;
  }

  /**
   * Listens for requests for paths
   */
  private listenForPathIPCRequests() {
    // Listen for db file path requests.
    ipcMain.handle(PathChannels.DB_FILE_PATH, () => this.dbFile);

    // Listen for global store path.
    ipcMain.handle(PathChannels.GLOBAL_STORE_PATH, () => this.globalStorePath);
  }
}

export default new MainPaths();
