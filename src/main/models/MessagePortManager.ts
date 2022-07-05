import { ipcMain } from 'electron';
import type { MessagePortMain } from 'electron';

// Channels
import { MessagePortChannels } from '@utils/channels/MessagePortChannels';

// Helpers
import { deferredPromise } from '@utils/helpers/';
import type { DeferredPromise } from '@utils/helpers/index';

// Type
import type { RendererWindows } from '../main';

export class MessagePortManager {
  private renderers: RendererWindows;
  private readerPortPromise: DeferredPromise<any>;
  private readerPort: Electron.MessagePortMain | null;

  constructor(renderers: RendererWindows) {
    this.renderers = renderers;
    this.readerPort = null;
    this.readerPortPromise = deferredPromise();
    this.init();
  }

  /**
   * Attaches the ipc listeners.
   */
  private async init() {
    // Make the UI wait for the reader port.
    ipcMain.handle(
      MessagePortChannels.READER_RENDERER,
      this.handleReaderPortRequest.bind(this)
    );

    // Listen for the reader port from the reader process.
    ipcMain.on('reader:port', (event) => {
      const port = event.ports[0];
      this.readerPort = port;
      this.readerPortPromise.resolve(true);
    });
  }

  /**
   * Handles the main ui request for reader message port.
   */
  private handleReaderPortRequest = async () => {
    await this.readerPortPromise;
    this.renderers.mainWindow?.webContents.postMessage('ports:reader', null, [
      this.readerPort as MessagePortMain,
    ]);
  };
}
