import { ipcMain } from 'electron';
import { Experiment } from '@electron/db/models/index';

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
  // Stream data from database function
  let offset = 0;
  const timer = new AccurateTimer(async () => {
    const data = await getBatchRecordingData(20, offset);
    console.log(data);

    if (data.length === 0) {
      timer.stop();
    }
    console.log(Date.now());
    event.reply('data:nirs-reader-review', data);
    offset += 100;
  }, 200);
  timer.start();
});
