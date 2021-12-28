import { ipcMain } from 'electron';
import { ProbeChannels } from '@utils/channels';
import ProbeManager from '../main/models/ProbesManager';

const probe = new ProbeManager(1);

// Create a new probe
ipcMain.handle(ProbeChannels.NewProbe, async (_event) => {});

// Selects the current probe
ipcMain.handle(ProbeChannels.SelectProbe, async (_event) => {
  probe.setCurrentProbe();
});

// Get the current probe intensities
ipcMain.handle(
  ProbeChannels.GetProbeIntensities,
  async () => await probe.getIntensities()
);

// Update probe intensities
ipcMain.handle(
  ProbeChannels.UpdateProbeIntensities,
  async (_event, intensities) => await probe.updateIntensity(intensities)
);
