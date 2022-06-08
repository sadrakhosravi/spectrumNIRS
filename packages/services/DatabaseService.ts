/*---------------------------------------------------------------------------------------------
 *  Database Service.
 *  Connects to the database shared worker thread using Comlink.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import * as Comlink from 'comlink';

// Interfaces
import type { IServices } from './IServicesInterface';
import type { DatabaseSharedWorker } from '../sharedWorkers/databaseSharedWorker';

export class DatabaseService implements IServices {
  /**
   * The database worker shared worker instance.
   */
  private dbWorker!: SharedWorker;

  dbConnection!: Comlink.Remote<DatabaseSharedWorker> | DatabaseSharedWorker;

  public get connection() {
    return this.dbConnection as DatabaseSharedWorker;
  }

  /**
   * Initialize service.
   */
  public initService = async () => {
    this.dbWorker = new SharedWorker(
      new URL('../sharedWorkers/databaseSharedWorker.ts', import.meta.url),
      { type: 'module' },
    );

    this.dbConnection = Comlink.wrap(this.dbWorker.port);
    const isInitialized = await await this.dbConnection.init(); // 2 awaits for comlink and db connection.
    return isInitialized;
  };

  /**
   * Shut down service.
   */
  async shutdownService() {
    // this.dbConnection?.close();
  }
}
