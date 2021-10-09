import { ipcMain } from 'electron';
import { Experiment, Recording } from '@electron/db/models/index';

// const { Op } = require('sequelize');

// Helpers
import AccurateTimer from '@electron/helpers/accurateTimer';

// Import DB Controllers
import { getBatchRecordingData } from '@controllers/recordingDBController';

/// DB Related IPCs ///

// Retrieve the numOfRecentExperiment most recent experiments from DB
ipcMain.handle(
  'db:get-recent-experiments',
  async (_event, numOfRecentExperiments) => {
    const experiments = await Experiment.findAll({
      limit: numOfRecentExperiments,
      order: [['createdAt', 'DESC']],
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
ipcMain.on('db:get-recordings', async (event) => {
  let offset = 0; // Start time
  const batchSize = 2000; // The number of records to fetch in one query
  const timerInterval = 1000; // Based on a 100samples/sec

  // Create an accurate timer to fetch data from the database
  const timer = new AccurateTimer(async () => {
    const data = await getBatchRecordingData(batchSize, offset);
    if (data.length === 0) {
      timer.stop();
    }
    console.log(Date.now());
    event.reply('data:nirs-reader-review', data);
    offset += batchSize;
  }, timerInterval);

  // Start the timer
  timer.start();
});

ipcMain.handle('db:get-recording-interval', async (_event, interval) => {
  console.log('Got the request');
  console.log(interval);

  return await Recording.findAll({ raw: true, limit: 500 });
});
