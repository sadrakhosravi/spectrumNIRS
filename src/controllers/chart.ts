import { ipcMain } from 'electron';

// Models
import ExportDB from '@electron/models/ExportDB';

// Constants
import { ChartChannels } from '@utils/channels';

ipcMain.on(ChartChannels.ExportAll, (_, experimentData: any) => {
  console.log('Export');
  const dbExport = new ExportDB(1);
  dbExport.exportToTextFile(experimentData);
});
