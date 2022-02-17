import { ipcMain } from 'electron';
import { ProbeChannels } from '@utils/channels';
import ProbeManager from '../main/models/ProbesManager';

// Get the default probe
(async () => {
  await ProbeManager.getDefaultProbe();
})();

ipcMain.handle(ProbeChannels.GetCurrentProbe, async () =>
  ProbeManager.getCurrentProbe()
);

// Create a new probe
ipcMain.handle(ProbeChannels.NewProbe, async (_event, data) =>
  ProbeManager.newProbe(data)
);

// Gets all the devices
ipcMain.handle(
  ProbeChannels.GetAllProbesOfDevice,
  async (_event, deviceId) => await ProbeManager.getAllProbesOfDevice(deviceId)
);

// Selects the current probe
ipcMain.handle(
  ProbeChannels.SelectProbe,
  async (_event, probeId: number) =>
    await ProbeManager.setCurrentProbe(probeId, true)
);

// Get the current probe intensities
ipcMain.handle(
  ProbeChannels.GetProbeIntensities,
  async () => await ProbeManager.getIntensities()
);

// Update probe intensities
ipcMain.handle(
  ProbeChannels.UpdateProbeIntensities,
  async (_event, intensities) => await ProbeManager.setIntensities(intensities)
);

// Deletes a new probe from the DB
ipcMain.handle(
  ProbeChannels.DeleteProbe,
  async (_event, probeId: number) => await ProbeManager.deleteProbe(probeId)
);

// Sets the selected probe as default
ipcMain.handle(
  ProbeChannels.SetProbeAsDefault,
  async (_event, probeId: number) => await ProbeManager.setDefaultProbe(probeId)
);
