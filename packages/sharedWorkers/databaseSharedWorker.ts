/*---------------------------------------------------------------------------------------------
 *  Shared Database Worker.
 *  Runs on a separate thread and manages database operations.
 *  Each process can connect to the database worker using the shared worker port.
 *  The database driver is still asynchronous and will spawn its own threads.
 *  Uses COMLINK for thread communication.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import * as Comlink from 'comlink';
import BetterSqlite3 from 'better-sqlite3';

// Helpers
import { checkForDbFolder } from './database/Base/checkForDbFolder';

// Types
import type { DatabaseConnectionType } from './database/types/Types';

// Tables
import { RecordingTable, DeviceTable } from './database';
import { Paths } from '../utils/helpers/Paths';

// Queries
import { DeviceQueries } from './database/Queries';

export type DatabaseQueriesType = {
  deviceQueries: DeviceQueries;
};

// The self managed class
export class DatabaseSharedWorker {
  /**
   * The database file path.
   */
  private readonly dbFilePath: string;
  /**
   * The database connection instance.
   */
  private readonly connection: DatabaseConnectionType;
  public readonly deviceQueries: DeviceQueries;

  constructor() {
    // Checks for db folder and creates it if not exist.
    checkForDbFolder();
    this.dbFilePath = Paths.getDBFilePath();
    this.connection = new BetterSqlite3(this.dbFilePath);

    this.applyPragmas();
    this.synchronizeTables();

    this.deviceQueries = new DeviceQueries(this.connection);
  }

  /**
   * Applies pragmas to the database for the best performance.
   */
  private async applyPragmas() {
    this.connection.exec('PRAGMA journal_mode = WAL;'); // Enables WAL Mode
    this.connection.exec('PRAGMA auto_vacuum = INCREMENTAL;'); // Enables auto vacuum
    this.connection.exec('PRAGMA synchronous = normal;'); // Disabled full synchronous
  }

  /**
   * Synchronizes the database tables.
   */
  private async synchronizeTables() {
    // Update and checks the recording table
    new RecordingTable(this.connection).init();
    new DeviceTable(this.connection).init();
  }
}

const dbWorker: DatabaseSharedWorker = new DatabaseSharedWorker();

/**
 * When a connection is made into this shared worker, expose `obj`
 * via the connection `port`.
 */
onconnect = function (event) {
  const port = event.ports[0];
  Comlink.expose(dbWorker, port);
};
