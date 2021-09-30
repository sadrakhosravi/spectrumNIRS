/**
 * IPC Communication for chart controls and electron.
 */

import { ipcMain } from 'electron';
import { Experiment, Recording } from '@electron/db/models/index';
import { hrtime } from 'process';

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

// Get all the recording data
ipcMain.handle('db:get-recordings', async (_event, data) => {
  console.log(data);
  const start = hrtime.bigint();
  const myData = await Recording.findAll({ raw: true, limit: 5000 });
  const stop = hrtime.bigint();
  console.log(stop - start);
  console.log('Out data', myData);
});

/**
 * All DB related IPCs
 */
// Creates a new experiment record in the database
ipcMain.handle('db:new-experiment', async (_event, data) => {
  // Default experiment settings JSON object
  const experimentSettings = {
    SamplingRate: '100',
    NumOfChannels: '4',
  };

  console.log(data);

  try {
    await Experiment.create({
      name: data.experimentName,
      description: data.experimentDescription,
      date: data.experimentDate,
      settings: experimentSettings,
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
});

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
