import { ipcMain } from 'electron';

// Models
import ExportDB from '@electron/models/ExportDB';

// Constants
import { ChartChannels } from '@utils/channels';

ipcMain.handle(ChartChannels.ExportAll, async (_, experimentData: any) => {
  console.log('Export');
  const dbExport = new ExportDB(1);
  return await dbExport.exportToTextFile(experimentData);
});
