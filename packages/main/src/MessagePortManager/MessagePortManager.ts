import { ipcMain } from 'electron';
import type { IpcMainEvent } from 'electron';

// Window obj
import { renderers } from '../index';

export class MessagePortManager {
  constructor() {
    this.init();
  }

  /**
   * Attaches the ipc listeners.
   */
  private init() {
    ipcMain.on('port:handle', this.handlePort.bind(this));
  }

  /**
   * Forwards the port to the main window renderer.
   */
  private handlePort(event: IpcMainEvent, data: string) {
    const [port] = event.ports;

    // Send to the main window.
    renderers.mainWindow?.webContents.postMessage('device:port', data, [port]);
  }
}
