import * as React from 'react';

import styles from './widgets.module.scss';

type WidgetsContainerType = {
  children: React.ReactNode;
  height?: '20%' | '25%' | '50%' | '75%' | '100%';
};

export const WidgetsContainer = ({
  children,
  height = '100%',
}: WidgetsContainerType) => {
  return (
    <div
      className={styles.WidgetsContainer}
      style={{ height: `calc(${height} - 0px)` }}
    >
      {children}
    </div>
  );
};
