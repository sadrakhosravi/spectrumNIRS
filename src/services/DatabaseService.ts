/*---------------------------------------------------------------------------------------------
 *  Database Service.
 *  Connects to the database shared worker thread using Comlink.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import * as Comlink from 'comlink';

// Interfaces
import type { IServices } from './IServicesInterface';
import type { DatabaseWorker } from '../renderer/main-ui/workers/dbWorker';

export class DatabaseService implements IServices {
  /**
   * The database worker shared worker instance.
   */
  private dbWorker!: Worker;

  dbConnection!: Comlink.Remote<DatabaseWorker> | DatabaseWorker;

  constructor() {
    this.dbWorker = new Worker(
      //@ts-ignore
      new URL('../renderer/main-ui/workers/dbWorker.ts', import.meta.url),
      { type: 'module' }
    );
  }

  public get connection() {
    return this.dbConnection as DatabaseWorker;
  }

  /**
   * Initialize service.
   */
  public initService = async () => {
    this.dbConnection = Comlink.wrap(this.dbWorker);
    const isInitialized = await await this.dbConnection.init(); // 2 awaits for comlink and db connection.
    console.log('DB initialized');
    return isInitialized;
  };

  /**
   * Shut down service.
   */
  async shutdownService() {
    // this.dbConnection?.close();
  }
}
