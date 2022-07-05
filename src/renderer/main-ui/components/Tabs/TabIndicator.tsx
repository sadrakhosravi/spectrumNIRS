import * as React from 'react';

// Styles
import styles from './tabs.module.scss';

type TabIndicatorType = {
  style?: React.CSSProperties;
};

export const TabIndicator = ({ style }: TabIndicatorType) => {
  return <div className={styles.TabIndicator} style={style} />;
};
