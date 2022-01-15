import fs from 'fs';
import createDBConnection from '../db/index';
import firstRun from './firstRun';

// Constants
import { databaseFile, databasePath, settingsPath } from '../main/paths';

const startup = async () => {
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
};

export default startup;
