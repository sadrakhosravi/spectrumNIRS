/**
 * IPC Communication for chart controls and electron.
 */

import { ipcMain } from 'electron';
const { Experiment } = require('../Database/models/index');

const dbIPC = () => {
  // Creates a new experiment record in the database
  ipcMain.on('db:new-experiment', async (_event, data) => {
    console.log(data);
    await Experiment.create({
      name: data.experimentName,
      description: data.experimentDescription,
    });
  });

  // Retrieve the numOfRecentExperiment most recent experiments from DB
  ipcMain.on(
    'db:get-recent-experiments',
    async (event, numOfRecentExperiments) => {
      console.log(numOfRecentExperiments);
      const experiments = await Experiment.findAll({
        limit: numOfRecentExperiments,
        attributes: { exclude: ['createdAt'] },
        raw: true,
      });

      event.sender.send('db:recent-experiments', experiments);
    }
  );
};

export default dbIPC;
