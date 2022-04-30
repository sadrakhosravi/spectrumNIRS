import { ipcRenderer } from 'electron';
import deviceReader from './DeviceReader';

// Channels
import { ReaderChannels } from '@utils/channels/ReaderChannels';

/**
 * Handles the necessary IPC communications
 */
class ReaderIPCService {
  constructor() {
    this.init();
  }

  /**
   * Sends an IPC message to the main webContents
   */
  public sendDeviceConnected(value: boolean) {
    ipcRenderer.sendTo(1, ReaderChannels.DEVICE_CONNECTED, value);
  }

  /**
   * Attaches all initial listeners
   */
  private init() {
    // Attach device settings update listener
    this.listenForDeviceSettingsUpdate();
  }

  /**
   * Listens for any update to device/probe settings
   */
  private listenForDeviceSettingsUpdate() {
    ipcRenderer.on(ReaderChannels.DEVICE_SETTING_UPDATE, (_, settings) =>
      deviceReader.handleDeviceSettingsUpdate(settings),
    );
  }
}

export const readerIPCService = new ReaderIPCService();
