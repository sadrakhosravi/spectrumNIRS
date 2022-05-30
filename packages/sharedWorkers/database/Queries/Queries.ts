// Types
import type { DatabaseConnectionType } from '../types/Types';

export class Queries {
  protected readonly connection: DatabaseConnectionType;
  constructor(connection: DatabaseConnectionType) {
    this.connection = connection;
  }

  // /**
  //  * Inserts the query to the database.
  //  */
  // public async insert(query: ISqlite.SqlType, ...params: any[]) {
  //   await this.connection.exec(query, ...params);
  // }

  // /**
  //  * Gets a single record from database.
  //  */
  // public async get(query: ISqlite.SqlType, ...params: any[]) {
  //   return await this.connection.get(query, ...params);
  // }

  // /**
  //  * Gets the query data from the database.
  //  */
  // public async getAll(query: ISqlite.SqlType, ...params: any[]) {
  //   return await this.connection.all(query, ...params);
  // }
}
