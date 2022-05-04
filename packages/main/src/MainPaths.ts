import { app } from 'electron';
import path from 'path';
import { ipcMain } from 'electron';

// Channels
import { PathChannels } from '../../utils/channels';

class MainPaths {
  private appName: string;
  private storePath: string;
  constructor() {
    this.appName = 'Spectrum';
    this.storePath = path.resolve(app.getPath('appData'), this.appName, 'Settings', 'Global');
    this.listenForPathIPCRequests();
  }

  /**
   * @returns the path of the global store.
   */
  public get globalStorePath() {
    return this.storePath;
  }

  /**
   * Listens for requests for paths
   */
  private listenForPathIPCRequests() {
    // Listen for global store path.
    ipcMain.handle(PathChannels.GLOBAL_STORE_PATH, () => this.globalStorePath);
  }
}

export default new MainPaths();
