import * as React from 'react';

// Styles
import * as styles from './tabs.module.scss';

// Types
type TabItemType = {
  header: string;
  children: JSX.Element | JSX.Element[];
};

export const TabItem = ({ children }: TabItemType) => {
  return (
    <div>
      <div className={styles.TabItem}>{children}</div>
    </div>
  );
};
