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

// Database Entities
export const databaseEntitiesPath =
  process.env.NODE_ENV === 'development'
    ? path.resolve(__dirname, '../db/entity')
    : path.resolve(__dirname);

// export const ExperimentsEntity = path.resolve(
//   databaseEntitiesPath,
//   'Experiments'
// );
// export const PatientsEntity = path.resolve(databaseEntitiesPath, 'Patients');
// export const RecordingsEntity = path.resolve(
//   databaseEntitiesPath,
//   'Recordings'
// );
// export const RecordingsDataEntity = path.resolve(
//   databaseEntitiesPath,
//   'RecordingsData'
// );
