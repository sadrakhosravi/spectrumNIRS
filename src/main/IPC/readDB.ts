import { BrowserWindow, ipcMain } from 'electron';
import { Experiment, Recording } from '@electron/db/models/index';
/**
 * All DB read related IPCs
 */

// Retrieve the numOfRecentExperiment most recent experiments from DB
ipcMain.handle(
  'db:get-recent-experiments',
  async (_event, numOfRecentExperiments) => {
    const experiments = await Experiment.findAll({
      limit: numOfRecentExperiments,
      attributes: { exclude: ['createdAt'] },
      raw: true,
    });
    console.log(experiments);

    return experiments;
  }
);

// Get experiment settings
ipcMain.on('db:get-experiment-settings', async (_event, id) => {
  const experimentSettings = await Experiment.findByPk(id, {
    attributes: ['id', 'settings'],
    raw: true,
  });

  console.log(experimentSettings);
});

// Get all the recording data
ipcMain.handle('db:get-recordings', async (_event, data) => {
  const mainWindow = BrowserWindow.getAllWindows()[0];

  console.log(data);
  const myData = await Recording.findAll({ raw: true, limit: 5000 });
  if (myData) {
    myData.forEach((record: any) => {
      const data = record.value.split(',');
      const outputArr = [
        parseFloat(data[0]),
        parseFloat(data[1]),
        parseFloat(data[2]),
        parseFloat(data[3]),
        parseFloat(data[4]),
      ];
      mainWindow.webContents.send('data:nirs-reader', outputArr);
      console.log(outputArr);
    });
  }
});
