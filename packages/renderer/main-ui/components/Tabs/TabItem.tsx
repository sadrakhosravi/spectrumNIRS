import * as React from 'react';

// Styles
import * as styles from './tabs.module.scss';

// Types
type TabItemType = {
  header: string;
  children: JSX.Element | JSX.Element[];
};

export const TabItem = ({ header }: TabItemType) => {
  return (
    <div>
      <div className={styles.TabItemHeader}>{header}</div>
      <div className={styles.TabItemBody}>
        <h1>Test</h1>
      </div>
    </div>
  );
};
