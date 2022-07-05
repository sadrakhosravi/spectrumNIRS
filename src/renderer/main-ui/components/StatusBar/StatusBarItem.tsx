import * as React from 'react';
import type { IconType } from 'react-icons/lib';

// Styles
import styles from './statusBar.module.scss';

type StatusBarItemProps = {
  text: string;
  icon: IconType;
  style?: React.CSSProperties;
};

const iconSettings = {
  size: '20px',
  color: 'red',
};

export const StatusBarItem = ({ icon, text, style }: StatusBarItemProps) => {
  return (
    <div className={styles.StatusBarItem} style={style}>
      <span>{text}</span>
      {icon.call(null, { ...iconSettings })}
    </div>
  );
};
