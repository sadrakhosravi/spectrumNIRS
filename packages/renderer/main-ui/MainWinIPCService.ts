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
