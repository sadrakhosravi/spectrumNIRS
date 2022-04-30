import * as React from 'react';

// Styles
import * as styles from './statusBar.module.scss';

type StatusBarItemProps = {
  text: string;
  icon: JSX.Element;
  style?: React.CSSProperties;
};

export const StatusBarItem = ({ icon, text, style }: StatusBarItemProps) => {
  return (
    <div className={styles.StatusBarItem} style={style}>
      <span>{text}</span>
      {icon}
    </div>
  );
};
