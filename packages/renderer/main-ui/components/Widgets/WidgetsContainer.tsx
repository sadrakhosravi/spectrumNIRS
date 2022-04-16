import * as React from 'react';

import * as styles from './widgets.module.scss';

type WidgetsContainerType = {
  children: React.ReactNode;
};

export const WidgetsContainer = ({ children }: WidgetsContainerType) => {
  return <div className={styles.WidgetsContainer}>{children}</div>;
};
