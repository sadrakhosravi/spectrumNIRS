import fs from 'fs';

import { Paths } from '../../../utils/helpers/Paths';

/**
 * Checks to see if the db folder exists, if not it creates it.
 * @returns a boolean indicating the operation was done.
 */
export const checkForDbFolder = () => {
  const dbFolderPath = Paths.getDBFolderPath();

  // If the folder does not exist, create it
  if (!fs.existsSync(dbFolderPath)) {
    fs.mkdirSync(dbFolderPath, { recursive: true });
  }

  return true;
};
