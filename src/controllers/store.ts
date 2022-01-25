import { ipcMain } from 'electron';

import MainStore from '@electron/models/MainStore';

// @ts-ignore
import GlobalStore from '@lib/globalStore/GlobalStore';

import { UserSettingsChannels } from '@utils/channels';

// Main Process Store
ipcMain.handle(UserSettingsChannels.AddSetting, (_event, { key, value }) =>
  MainStore.set(key, value)
);
ipcMain.handle(UserSettingsChannels.GetSetting, (_event, key) =>
  MainStore.get(key)
);
ipcMain.handle(UserSettingsChannels.RemoveSetting, (_event, key) =>
  MainStore.delete(key)
);
