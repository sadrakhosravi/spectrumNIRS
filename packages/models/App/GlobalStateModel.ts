/*---------------------------------------------------------------------------------------------
 *  Global Data State Model.
 *
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { action, makeObservable, observable } from 'mobx';
import { PathChannels } from '../../utils/channels';
import { ipcRenderer } from 'electron';

/**
 * The global state model for renderers to use paths and variables that are
 * only available in the main process.
 */
class GlobalPathsModel {
  @observable private storePath: string;
  @observable private dbPath: string;
  @observable private dbFile: string;

  constructor() {
    this.storePath = '';
    this.dbPath = '';
    this.dbFile = '';

    makeObservable(this);
  }

  /**
   * The path of the global store.
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
   * Gets the paths from the main process.
   */
  @action public async syncPathState() {
    this.dbFile = await ipcRenderer.invoke(PathChannels.DB_FILE_PATH);
    this.storePath = await ipcRenderer.invoke(PathChannels.GLOBAL_STORE_PATH);
  }
}

export let globalPathsModel: GlobalPathsModel;

(async () => {
  globalPathsModel = new GlobalPathsModel();
  await globalPathsModel.syncPathState();
})();

export default globalPathsModel;
