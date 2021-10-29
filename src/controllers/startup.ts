import fsPromises from 'fs/promises';
import { appDataPath, databasePath, settingsPath } from '@electron/paths';

(async () => {
  // Create the main application data folder
  await fsPromises.mkdir(appDataPath, { recursive: true });

  // Create the database folder
  await fsPromises.mkdir(databasePath, { recursive: true });

  // Create the settings folder
  await fsPromises.mkdir(settingsPath, { recursive: true });
})();
