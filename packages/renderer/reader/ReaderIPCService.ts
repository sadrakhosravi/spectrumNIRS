import { ipcRenderer } from 'electron';

/**
 * Handles the necessary IPC communications
 */
class ReaderIPCService {
  constructor() {}

  /**
   * Sends the given parameter and channel name to the UI process.
   */
  public sendToUI(channel: string, value?: any) {
    ipcRenderer.sendTo(1, channel, value);
  }
}
export const readerIPCService = new ReaderIPCService();
