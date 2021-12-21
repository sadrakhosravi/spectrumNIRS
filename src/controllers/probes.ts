import { ipcMain } from 'electron';
import { ProbeChannels } from '@utils/channels';

// Models
import ProbeManager from '../main/models/ProbesManager';

const probeManager = new ProbeManager();

// Update probe intensities
ipcMain.handle(
  ProbeChannels.UpdateProbeIntensities,
  async (_event, intensities: string[]) =>
    await probeManager.updateIntensities(intensities)
);

// Create a new probe
ipcMain.handle(
  ProbeChannels.NewProbe,
  async (_event, data: any) => await probeManager.newProbe(data)
);

// Get the current probe intensities
ipcMain.handle(
  ProbeChannels.GetProbeIntensities,
  async () => await probeManager.getIntensities()
);
