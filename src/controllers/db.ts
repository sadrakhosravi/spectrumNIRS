import Database from '@electron/models/Database';
import { ipcMain } from 'electron';

ipcMain.handle('database-vacuum', async () => await Database.vacuum());
