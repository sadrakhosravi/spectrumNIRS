import * as React from 'react';

// Styles
import * as styles from './statusBar.module.scss';

type StatusBarItemProps = {
  text: string;
  icon: JSX.Element;
};

export const StatusBarItem = ({ icon, text }: StatusBarItemProps) => {
  return (
    <div className={styles.StatusBarItem}>
      {icon}
      <span>{text}</span>
    </div>
  );
};
