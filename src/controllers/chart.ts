import { ipcMain } from 'electron';

// Models
import ExportDB from '@electron/models/ExportDB';

// Constants
import { ChartChannels } from '@utils/channels';

ipcMain.handle(ChartChannels.ExportAll, async (_event, recordingId: number) => {
  console.log('Export');
  const dbExport = new ExportDB(1);
  return await dbExport.exportToTextFile(recordingId);
});
