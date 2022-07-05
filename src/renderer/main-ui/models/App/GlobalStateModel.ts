/*---------------------------------------------------------------------------------------------
 *  Global Data State Model.
 *
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { ipcRenderer } from 'electron';
import * as Comlink from 'comlink';
import { deferredPromise, DeferredPromise } from '@utils/helpers';

// Types
import type DeviceManager from 'reader/models/DeviceManager';
import { MessagePortChannels } from '@utils/channels';

/**
 * The global state model for renderers to use paths and variables that are
 * only available in the main process.
 */
class GlobalStateModel {
  public readonly readerPortPromise: DeferredPromise<unknown>;
  /**
   * The device manager remote class instance.
   */
  public readonly reader!: Comlink.Remote<DeviceManager>; // Readonly to prevent a getter method - Performance reasons
  constructor() {
    this.readerPortPromise = deferredPromise();

    // Wait for the port from the main process and resolve the promise
    ipcRenderer.on('ports:reader', async (event) => {
      //@ts-ignore
      this.reader = Comlink.wrap(event.ports[0]);

      this.readerPortPromise.resolve(true);
    });

    ipcRenderer.invoke(MessagePortChannels.READER_RENDERER);
  }
}

export default new GlobalStateModel();
