import path from 'path';
import { GlobalEnum } from '../enums/GlobalEnum';

const appDataFolder = process.env.APPDATA as string;

/**
 * Returns the paths to the global state files and folders.
 */
export class Paths {
  /**
   * @returns the app data folder path.
   */
  public static getAppDataFolderPath() {
    return path.join(appDataFolder, GlobalEnum.APP_DATA_FOLDER_NAME);
  }

  /**
   * @returns the database folder path.
   */
  public static getDBFolderPath() {
    return path.join(this.getAppDataFolderPath(), GlobalEnum.DB_FOLDER_PATH);
  }

  /**
   * @returns the database file path.
   */
  public static getDBFilePath() {
    return path.join(this.getDBFolderPath(), GlobalEnum.DB_FILE_NAME);
  }

  /**
   * @returns the settings folder path.
   */
  public static getSettingsFolderPath() {
    return path.join(this.getAppDataFolderPath(), GlobalEnum.GLOBAL_STATE_FOLDER);
  }

  /**
   * @returns the global state folder path.
   */
  public static getGlobalStateFolderPath() {
    return path.join(this.getSettingsFolderPath(), GlobalEnum.GLOBAL_STATE_FOLDER);
  }
}
