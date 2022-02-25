import { ipcMain } from 'electron';

// Models
import ExportDB from '@electron/models/ExportDB';

// Constants
import { ChartChannels } from '@utils/channels';

ipcMain.handle(
  ChartChannels.ExportAll,
  async (_event, { recordingId, type }) => {
    return await ExportDB.exportToFile(recordingId, type);
  }
);

ipcMain.handle(
  ChartChannels.GetExportRange,
  async (_event) => await ExportDB.findRangeOfExportData()
);
