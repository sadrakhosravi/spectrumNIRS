import { ipcRenderer } from 'electron';

export class MainWinIPCService {
  constructor() {}

  /**
   * Sends an IPC message on a specified channel to Reader process
   */
  public sendToReader(channel: string, args?: any) {
    ipcRenderer.sendTo(2, channel, args);
  }
}

export default new MainWinIPCService();
