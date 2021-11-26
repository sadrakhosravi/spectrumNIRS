import fsPromises from 'fs/promises';
import { ipcMain } from 'electron';
import Store from 'electron-store';

// Constants
import { appDataPath, databasePath, settingsPath } from '../main/paths';
import { UserSettingsChannels } from '../utils/channels';

(async () => {
  // Create the main application data folder
  await fsPromises.mkdir(appDataPath, { recursive: true });

  // Create the database folder
  await fsPromises.mkdir(databasePath, { recursive: true });

  // Create the settings folder
  await fsPromises.mkdir(settingsPath, { recursive: true });

  const userSettings = new Store({
    name: 'user-settings',
    fileExtension: 'json',
    cwd: settingsPath,
  });
  console.log(settingsPath);
  userSettings.set('1', 'Test');
  console.log(userSettings.get('1'));

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
