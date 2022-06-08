/*---------------------------------------------------------------------------------------------
 *  Shared Database Worker.
 *  Runs on a separate thread and manages database operations.
 *  Each process can connect to the database worker using the shared worker port.
 *  The database driver is still asynchronous and will spawn its own threads.
 *  Uses COMLINK for thread communication.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/
import 'reflect-metadata';

import * as Comlink from 'comlink';

import { DataSource } from 'typeorm';

// Helpers
import { checkForDbFolder } from './database/Base/checkForDbFolder';
import { Paths } from '../utils/helpers/Paths';

// Types
import type { DatabaseConnectionType } from './database/types/Types';

// Tables Entities
import { RecordingTable, RecordingDataTable, DeviceConfigsTable, DevicesTable } from './database';

// Queries
import { DeviceQueries } from './database/Queries';

// export type DatabaseQueriesType = {
//   deviceQueries: DeviceQueries;
// };

// The self managed class
export class DatabaseSharedWorker {
  /**
   * The database file path.
   */
  private readonly dbFilePath: string;
  /**
   * The database connection instance.
   */
  protected readonly connection: DatabaseConnectionType;
  /**
   * Collection of all the device queries as a class.
   */
  public readonly deviceQueries!: DeviceQueries;
  initialized: boolean;

  constructor() {
    // Checks for db folder and creates it if not exist.
    checkForDbFolder();
    this.dbFilePath = Paths.getDBFilePath();

    this.connection = new DataSource({
      type: 'better-sqlite3',
      database: this.dbFilePath,
      entities: [RecordingTable, RecordingDataTable, DevicesTable, DeviceConfigsTable],
      synchronize: true, // Debug
      dropSchema: false, // Debug
    });

    this.initialized = false;
  }

  public async init() {
    if (this.initialized) return true;

    await this.connection.initialize();
    await this.applyPragmas();

    this.initialized = true;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.deviceQueries = new DeviceQueries(this.connection);

    return true;
  }

  /**
   * Applies pragmas to the database for the best performance.
   */
  private async applyPragmas() {
    await this.connection.query('PRAGMA journal_mode = WAL;'); // Enables WAL Mode
    await this.connection.query('PRAGMA auto_vacuum = INCREMENTAL;'); // Enables auto vacuum
    await this.connection.query('PRAGMA synchronous = normal;'); // Disabled full synchronous
  }
}

const dbWorker: DatabaseSharedWorker = new DatabaseSharedWorker();

onconnect = async (event) => {
  const [port] = event.ports;
  Comlink.expose(dbWorker, port);
};
