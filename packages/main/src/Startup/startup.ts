import fs from 'fs';

// Types
import MainPaths from '../MainPaths';

/**
 * Runs the startup folder and file checks.
 */
export const startup = async () => {
  console.time('startup');
  // If database folder does not exist create it
  if (!fs.existsSync(MainPaths.dbFolderPath)) {
    fs.mkdirSync(MainPaths.dbFolderPath);
  }

  console.timeEnd('startup');
};
