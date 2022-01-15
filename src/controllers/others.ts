import { ipcMain } from 'electron';
import { databaseFile, settingsPath } from '../main/paths';

ipcMain.handle('get-database-path', () => databaseFile);
ipcMain.handle('get-settings-path', () => settingsPath);
