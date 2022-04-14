import * as React from 'react';

// Styles
import * as styles from './home.module.scss';

// Components
import { SearchInput } from '/@/components/Form';
import { Table, TableColumns, TableItem } from '/@/components/Elements/Table';

// Types
import type { ColumnDataSourceType } from '/@/components/Elements/Table';

const testColumns: ColumnDataSourceType[] = [
  {
    text: 'Name',
    width: 60,
  },
  {
    text: 'Actions',
    width: 40,
  },
];

export const HomeLeftArea = () => {
  return (
    <div>
      <div className="text-larger mb">Open Recent Files</div>
      <div className={styles.LeftSideSearchBar}>
        <SearchInput />
      </div>
      <div className="mt">
        <Table>
          <TableColumns dataSource={testColumns} />
          <TableItem text="Test" description="Test" />
          <TableItem text="Test" description="Test" />
          <TableItem text="Test" description="Test" />
        </Table>
      </div>
    </div>
  );
};
