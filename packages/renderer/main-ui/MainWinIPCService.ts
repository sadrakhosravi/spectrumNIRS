import { ipcRenderer } from 'electron';

// Channels
import { ReaderChannels } from '@utils/channels/ReaderChannels';

// View Models
import { deviceInfoVM } from '@viewmodels/Singletons/DeviceInfoViewModel';

export class MainWinIPCService {
  constructor() {
    this.init();
  }

  /**
   * Sends an IPC message on a specified channel to Reader process
   */
  public sendToReader(channel: string, args?: any) {
    ipcRenderer.sendTo(2, channel, args);
  }

  /**
   * Attaches the IPC listeners for the main window.
   */
  private init() {
    // Listen for device connection
    this.listenToDeviceConnection();
  }

  /**
   * Listens for device connection
   */
  private listenToDeviceConnection() {
    ipcRenderer.on(ReaderChannels.DEVICE_CONNECTED, (_, isConnected) =>
      deviceInfoVM.setIsDeviceConnected(isConnected),
    );
  }
}

export default new MainWinIPCService();
