import { ipcMain } from 'electron';
import { ExperimentChannels } from 'utils/channels';

// Models
import Experiment from '@electron/models/Experiment';

// Creates a new experiment record with one patient in the database
ipcMain.handle(
  ExperimentChannels.NewExp,
  async (_event, data: any) => await Experiment.createExperiment(data)
);

// Retrieve the numOfRecentExperiment most recent experiments from DB
ipcMain.handle(
  ExperimentChannels.getRecentExperiments,
  async (_event, limit: number) => Experiment.getRecentExperiments(limit)
);
