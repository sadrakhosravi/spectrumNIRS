import { ipcRenderer } from 'electron';

export class MainWinIPCService {
  constructor() {}

  /**
   * Sends an IPC message on a specified channel to Reader process
   */
  public sendToReader(channel: string, arg1?: any, arg2?: any) {
    ipcRenderer.sendTo(2, channel, arg1, arg2);
  }
}

export default new MainWinIPCService();
