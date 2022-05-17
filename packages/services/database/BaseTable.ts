import type { DatabaseConnectionType } from '../DatabaseService';

type TableInfoColumnType = {
  name: string;
  type: string;
};

export type ColumnType = {
  name: string;
  type: SqliteColumnTypeEnum;
};

export enum SqliteColumnTypeEnum {
  // Strings
  TEXT = 'TEXT',
  VARCHAR = 'VARCHAR',
  NCHAR = 'NCHAR',

  // Numbers
  AUTOINCREMENT_PK_ID = 'INTEGER PRIMARY KEY AUTOINCREMENT',
  INTEGER = 'INTEGER',

  // Binary
  BLOB = 'BLOB',
}

export class BaseTable {
  private connection: DatabaseConnectionType;
  private tableName: string;
  columns: ColumnType[];

  // Constructor
  constructor(connection: DatabaseConnectionType, tableName: string, columns: ColumnType[]) {
    this.connection = connection;
    this.tableName = tableName;
    this.columns = columns;
  }

  public async init() {
    await this.createTableIfNotExists();
    await this.checkAndUpdateColumns();
  }

  /**
   * Creates the table and adds the column if table does not exists.
   */
  private async createTableIfNotExists() {
    const columns = this.columns.map((column) => `${column.name} ${column.type}`);

    await this.connection.exec(
      `CREATE TABLE IF NOT EXISTS ${this.tableName} (${columns.join(',')});`,
    );
  }

  /**
   * Checks for new columns and alters the table.
   */
  private async checkAndUpdateColumns() {
    const currentColumns = (await this.connection.all(
      `PRAGMA table_info(${this.tableName})`,
    )) as TableInfoColumnType[];

    // Remove columns first
    currentColumns.forEach((column) => {
      const columnExists = this.columns.find((col) => col.name === column.name);

      // Delete column if not exists
      if (!columnExists) {
        this.connection.exec(`ALTER TABLE ${this.tableName} DROP ${column.name}`);
      }
    });

    // Add columns that do not exist
    this.columns.forEach((column) => {
      const columnExists = currentColumns.find((col) => col.name === column.name);

      if (!columnExists) {
        this.connection.exec(`ALTER TABLE ${this.tableName} ADD ${column.name} ${column.type}`);
      }
    });
  }
}
