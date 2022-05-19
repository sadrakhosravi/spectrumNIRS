import { ipcRenderer } from 'electron';
import deviceReader from './DeviceReader';

// Channels
import ReaderChannels from '../../utils/channels/ReaderChannels';

/**
 * Handles the necessary IPC communications
 */
class ReaderIPCService {
  constructor() {
    this.init();
  }

  /**
   * Sends the given parameter and channel name to the UI process.
   */
  public sendToUI(channel: string, value?: any) {
    ipcRenderer.sendTo(1, channel, value);
  }

  /**
   * Sends an IPC message to the main webContents
   */
  public sendDeviceConnected(value: boolean) {
    ipcRenderer.sendTo(1, ReaderChannels.DEVICE_CONNECTED, value);
  }

  /**
   * Sends the data received from the device to the main ui.
   * @param data
   */
  public sendDeviceData(data: any) {
    ipcRenderer.sendTo(1, ReaderChannels.DEVICE_DATA, data);
  }

  /**
   * Sends the device input response to the main UI.
   * @param status the status of the device input.
   */
  public sendDeviceInputStatus(status: boolean | undefined) {
    ipcRenderer.sendTo(1, ReaderChannels.DEVICE_INPUT_RESPONSE, status);
  }

  /**
   * Attaches all initial listeners
   */
  private init() {
    // Attach device settings update listener
    this.listenForDeviceSettingsUpdate();

    // Listen for STOP and START from the UI.
    this.listenForDeviceStart();
    this.listenForDeviceStop();
  }

  /**
   * Listens for any update to device/probe settings
   */
  private listenForDeviceSettingsUpdate() {
    ipcRenderer.on(ReaderChannels.DEVICE_SETTING_UPDATE, (_, settings) =>
      deviceReader.handleDeviceSettingsUpdate(settings),
    );
  }

  /**
   * Listens for start signal from the main ui.
   */
  private listenForDeviceStart() {
    ipcRenderer.on(ReaderChannels.DEVICE_START, () => deviceReader.handleDeviceStart());
  }

  /**
   * Listens for stop signal from the main ui.
   */
  private listenForDeviceStop() {
    ipcRenderer.on(ReaderChannels.DEVICE_STOP, () => deviceReader.handleDeviceStop());
  }
}

export const readerIPCService = new ReaderIPCService();
