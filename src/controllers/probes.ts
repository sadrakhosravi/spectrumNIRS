import { ipcMain } from 'electron';
import { ProbeChannels } from '@utils/channels';
import ProbeManager from '../main/models/ProbesManager';

const probe = new ProbeManager();

// Get the default probe
(async () => {
  await probe.getDefaultProbe();
})();

ipcMain.handle(ProbeChannels.GetCurrentProbe, async () =>
  probe.getCurrentProbe()
);

// Create a new probe
ipcMain.handle(ProbeChannels.NewProbe, async (_event) => {});

// Gets all the devices
ipcMain.handle(
  ProbeChannels.GetAllDevices,
  async () => await probe.getAllDevices()
);

// Gets all the devices
ipcMain.handle(
  ProbeChannels.GetAllProbesOfDevice,
  async (_event, deviceId) => await probe.getAllProbesOfDevice(deviceId)
);

// Selects the current probe
ipcMain.handle(ProbeChannels.SelectProbe, async (_event, probeId: number) =>
  probe.setCurrentProbe(probeId)
);

// Get the current probe intensities
ipcMain.handle(
  ProbeChannels.GetProbeIntensities,
  async () => await probe.getIntensities()
);

// Update probe intensities
ipcMain.handle(
  ProbeChannels.UpdateProbeIntensities,
  async (_event, intensities) => await probe.setIntensities(intensities)
);
