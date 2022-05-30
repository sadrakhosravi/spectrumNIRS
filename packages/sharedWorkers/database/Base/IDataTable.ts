export interface IDataTable {
  /**
   * Initializes the recording table. Should contain all column and table altercations here.
   */
  init(): void;

  /**
   * Should create the table if not exist.
   */
  createTableIfNotExists(): void;

  /**
   * Should check and update the table for each column. (Add/ remove column if not exist).
   */
  checkAndUpdateColumns(): void;
}
