import path from 'path';
import { app } from 'electron';

// Constants
const name = 'SpectrumNIRS';

// Main application data path
export const appDataPath = path.join(app.getPath('appData'), name);

// Database data path
export const databasePath = path.join(path.join(appDataPath, 'database'));

// Settings data path
export const settingsPath = path.join(path.join(appDataPath, 'settings'));
