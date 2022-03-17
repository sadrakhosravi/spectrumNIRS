import fsPromises from 'fs/promises';

// Constants
import {
  appDataPath,
  databasePath,
  settingsPath,
  initialDbFilePath,
  initialSettingsFilePath,
  databaseFile,
  settingsFilePath,
  documentsSettingsPath,
} from '../main/paths';

const firstRun = async () => {
  // Create the main application data folder
  await fsPromises.mkdir(appDataPath, { recursive: true });

  // Create the database folder
  await fsPromises.mkdir(databasePath, { recursive: true });

  // Create the settings folder
  await fsPromises.mkdir(settingsPath, { recursive: true });

  // Create the documents setting folder
  await fsPromises.mkdir(documentsSettingsPath, { recursive: true });

  // Copy initial data to the related folders
  try {
    await fsPromises.rename(initialDbFilePath, databaseFile);
    await fsPromises.rename(initialSettingsFilePath, settingsFilePath);
  } catch (error: any) {
    console.error(error);
  }
};

export default firstRun;
