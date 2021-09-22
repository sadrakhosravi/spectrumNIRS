/**
 * IPC Communication for chart controls and electron.
 */

import { ipcMain } from 'electron';
const { Experiment } = require('../Database/models/index');

/**
 * All DB related IPCs
 */
const dbIPC = () => {
  // Creates a new experiment record in the database
  ipcMain.on('db:new-experiment', async (_event, data) => {
    // Default experiment settings JSON object
    const experimentSettings = {
      SamplingRate: '100',
      NumOfChannels: '4',
    };

    console.log(data);
    await Experiment.create({
      name: data.experimentName,
      description: data.experimentDescription,
      date: data.experimentDate,
      settings: experimentSettings,
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

  /**
   * Get experiment settings
   */
  ipcMain.on('db:get-experiment-settings', async (_event, id) => {
    const experimentSettings = await Experiment.findByPk(id, {
      attributes: ['id', 'settings'],
      raw: true,
    });

    console.log(experimentSettings);
  });
};

export default dbIPC;
