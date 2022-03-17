import path from 'path';
import { app } from 'electron';

// Constants
const appName = 'Beast Spectrum';
// Resources path
export const initialFilesPath = path.join(
  __dirname,
  '../../resources/initialData'
);
export const initialDbFilePath = path.join(initialFilesPath, 'spectrum.db');
export const initialSettingsFilePath = path.join(
  initialFilesPath,
  'user-settings.json'
);

// Main application data path
export const appDataPath = path.join(app.getPath('appData'), appName);

// Database data path
export const databasePath = path.join(appDataPath, 'database');
export const databaseRecordingsPath = path.join(databasePath, 'recordings');
export const databaseFile = path.join(databasePath, 'spectrum.db');

// Settings data path
export const settingsPath = path.join(appDataPath, 'settings');
export const settingsFilePath = path.join(settingsPath, 'user-settings.json');

// Documents path
export const documentsPath = app.getPath('documents');
export const documentsSettingsPath = path.join(documentsPath, 'Spectrum NIRS');
