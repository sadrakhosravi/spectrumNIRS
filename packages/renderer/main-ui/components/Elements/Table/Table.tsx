import * as React from 'react';

// Styles
import * as styles from './table.module.scss';

type TableType = {
  children: JSX.Element | JSX.Element[];
};

export const Table = ({ children }: TableType) => {
  return <div className={styles.Table}>{children}</div>;
};

export type ColumnDataSourceType = {
  /**
   * Column name
   */
  text: string;
  /**
   * Column width in percentage (%)
   */
  width: number;
};

type TableColumnsType = {
  dataSource: ColumnDataSourceType[];
};

export const TableColumns = ({ dataSource }: TableColumnsType) => {
  return (
    <div className={styles.TableColumn}>
      {dataSource.map((column) => (
        <span key={column.text + column.width.toString()} style={{ width: `${column.width}%` }}>
          {column.text}
        </span>
      ))}
    </div>
  );
};

type TableItemType = {
  text: string;
  description?: string;
};
export const TableItem = ({ text, description }: TableItemType) => {
  return (
    <div className={styles.TableItem} tabIndex={2}>
      <div>
        <span className="text-larger">{text}</span>
        <span>{description}</span>
      </div>
    </div>
  );
};