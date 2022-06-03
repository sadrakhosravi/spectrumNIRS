import { ipcMain } from 'electron';
import type { IpcMainEvent, MessagePortMain } from 'electron';

// Channels
import { MessagePortChannels } from '../../../utils/channels';

// Helpers
import { deferredPromise } from '../../../utils/helpers';
import type { DeferredPromise } from '../../../utils/helpers';
import { renderers } from '../index';
export class MessagePortManager {
  private readerPort: Electron.MessagePortMain | null;
  private readerPortPromise: DeferredPromise<any>;

  constructor() {
    this.readerPortPromise = deferredPromise();
    this.readerPort = null;
    this.init();
  }

  /**
   * Attaches the ipc listeners.
   */
  private async init() {
    ipcMain.handle(MessagePortChannels.READER_RENDERER, this.handleReaderPortRequest);
    ipcMain.on('window:port', this.handleWindowPort.bind(this));
  }

  /**
   *  Forwards the port window message port from one context to the main window process.
   */
  private handleWindowPort(event: IpcMainEvent, data: string) {
    console.log('Window port');
    const [port] = event.ports;

    if (data === 'reader') {
      this.readerPort = port;
      this.readerPortPromise.resolve(true);
    }
  }

  /**
   * Handles the main ui request for reader message port.
   */
  private handleReaderPortRequest = async () => {
    await this.readerPortPromise;
    renderers.mainWindow?.webContents.postMessage('ports:reader', null, [
      this.readerPort as MessagePortMain,
    ]);
  };
}
