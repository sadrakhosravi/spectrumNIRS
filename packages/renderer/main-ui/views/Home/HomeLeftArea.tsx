import * as React from 'react';

// Styles
import * as styles from './home.module.scss';

// Components
import { SearchInput } from '/@/components/Form';
import { Table, TableItem } from '/@/components/Elements/Table';

// Icons
import { FiFile } from 'react-icons/fi';

export const HomeLeftArea = () => {
  return (
    <div>
      <div className={styles.LeftSideSearchBar}>
        <SearchInput placeholder="Search recording by name ..." />
      </div>
      <div className="mt">
        <Table>
          <TableItem text="Test" description="Test" icon={<FiFile size="42px" />} />
          <TableItem text="Test" description="Test" />
          <TableItem text="Test" description="Test" />
        </Table>
      </div>
    </div>
  );
};
