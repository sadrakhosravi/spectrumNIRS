import { ipcMain } from 'electron';

// Models
import ExportDB from '@electron/models/ExportDB';

// Constants
import { ChartChannels } from '@utils/channels';

ipcMain.handle(
  ChartChannels.GetExportRange,
  async (_event) => await ExportDB.findRangeOfExportData()
);
