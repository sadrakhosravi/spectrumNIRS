/*---------------------------------------------------------------------------------------------
 *  Database Service.
 *  Connects to the database shared worker thread using Comlink.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import * as Comlink from 'comlink';
import { ipcRenderer } from 'electron';

// Interfaces
import type { IServices } from './IServicesInterface';
import type { DatabaseSharedWorker } from '../sharedWorkers/databaseSharedWorker';

export class DatabaseService implements IServices {
  /**
   * The database worker shared worker instance.
   */
  private dbWorker!: SharedWorker;

  dbConnection: Comlink.Remote<DatabaseSharedWorker> | null;
  constructor() {
    this.dbConnection = null;
  }

  public get connection() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return this.dbConnection as DatabaseSharedWorker;
  }

  /**
   * Initialize service.
   */
  public initService = async () => {
    console.log('Shared worker created');
    this.dbWorker = new SharedWorker(
      new URL('../sharedWorkers/databaseSharedWorker.ts', import.meta.url),
      { type: 'module' },
    );

    this.dbConnection = Comlink.wrap(this.dbWorker.port);

    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        ipcRenderer.invoke('open-dev-tools');
      }, 1000);
    }
  };

  /**
   * Shut down service.
   */
  async shutdownService() {
    // this.dbConnection?.close();
  }
}
