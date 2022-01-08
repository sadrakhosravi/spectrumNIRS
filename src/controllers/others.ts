import { ipcMain } from 'electron';
import { databaseFile } from '../main/paths';

ipcMain.handle('get-database-path', () => databaseFile);
