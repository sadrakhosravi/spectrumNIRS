/*---------------------------------------------------------------------------------------------
 *  Database Service.
 *  SQLITE database connection service.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import Sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Schema
import { RecordingTable } from './database/RecordingTable';

// Interfaces
import type { IServices } from './IServicesInterface';

// Types
import type { Database } from 'sqlite';
import globalPathsModel from '../models/App/GlobalStateModel';
export type DatabaseConnectionType = Database<Sqlite3.Database, Sqlite3.Statement>;

export class DatabaseService implements IServices {
  dbConnection: DatabaseConnectionType | null;
  constructor() {
    this.dbConnection = null;
  }

  public get connection() {
    return this.dbConnection as DatabaseConnectionType;
  }

  /**
   * Initialize service.
   */
  public initService = async () => {
    // Create the database or connection instance.
    this.dbConnection = await open({
      filename: globalPathsModel.dbFilePath,
      driver: Sqlite3.Database,
    });

    // Apply pragmas
    await this.dbConnection.exec('PRAGMA journal_mode = WAL;');
    await this.dbConnection.exec('PRAGMA auto_vacuum = INCREMENTAL;');
    await this.dbConnection.exec('PRAGMA synchronous = normal;');

    // Update Schema
    await new RecordingTable(this.dbConnection).init();
  };

  /**
   * Shut down service.
   */
  async shutdownService() {
    this.dbConnection?.close();
  }
}
