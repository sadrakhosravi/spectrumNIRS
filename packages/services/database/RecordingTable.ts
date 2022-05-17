// Parent class
import { BaseTable, SqliteColumnTypeEnum } from './BaseTable';

// Types
import type { DatabaseConnectionType } from '../DatabaseService';
import type { ColumnType } from './BaseTable';

export class RecordingTable extends BaseTable {
  constructor(connection: DatabaseConnectionType) {
    // Table name
    const tableName = 'recordings';

    // Columns
    const columns: ColumnType[] = [
      {
        name: 'id',
        type: SqliteColumnTypeEnum.NCHAR,
      },
      {
        name: 'name',
        type: SqliteColumnTypeEnum.TEXT,
      },
      {
        name: 'description',
        type: SqliteColumnTypeEnum.TEXT,
      },
      {
        name: 'created_timestamp',
        type: SqliteColumnTypeEnum.INTEGER,
      },
      {
        name: 'last_update_timestamp',
        type: SqliteColumnTypeEnum.INTEGER,
      },
      {
        name: 'settings',
        type: SqliteColumnTypeEnum.BLOB,
      },
    ];

    // The parent will take care of the rest
    super(connection, tableName, columns);
  }
}
