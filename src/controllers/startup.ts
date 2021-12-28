import fs from 'fs';
import { ipcMain } from 'electron';
import Store from 'electron-store';
import createDBConnection from '../db/index';
import firstRun from './firstRun';

// Constants
import { databaseFile, databasePath, settingsPath } from '../main/paths';
import { UserSettingsChannels } from '../utils/channels';

(async () => {
  try {
    // Check if the spectrum files and folders exist
    if (
      !fs.existsSync(databaseFile) ||
      !fs.existsSync(databasePath) ||
      !fs.existsSync(settingsPath)
    ) {
      await firstRun();
    }
    // Check for initial data and insert necessary data
  } catch (error: any) {
    throw new Error(error.message);
  }

  // Create connection
  await createDBConnection();

  const userSettings = new Store({
    name: 'user-settings',
    fileExtension: 'json',
    cwd: settingsPath,
  });

  ipcMain.handle(UserSettingsChannels.AddSetting, (_event, { key, value }) =>
    userSettings.set(key, value)
  );
  ipcMain.handle(UserSettingsChannels.GetSetting, (_event, key) =>
    userSettings.get(key)
  );
  ipcMain.handle(UserSettingsChannels.RemoveSetting, (_event, key) =>
    userSettings.delete(key)
  );
})();
