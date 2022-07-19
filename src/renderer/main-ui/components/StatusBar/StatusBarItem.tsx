import Tippy from '@tippyjs/react';
import * as React from 'react';
import type { IconType } from 'react-icons/lib';

// Styles
import styles from './statusBar.module.scss';

type StatusBarItemProps = {
  text: string;
  icon: IconType;
  iconColor?: 'red' | 'green' | 'white';
  tooltip?: string;
  style?: React.CSSProperties;
};

const iconSettings = {
  size: '20px',
  color: 'red',
};

export const StatusBarItem = ({
  icon,
  text,
  iconColor,
  tooltip,
  style,
}: StatusBarItemProps) => {
  if (iconColor) iconSettings.color = iconColor;

  if (tooltip)
    return (
      <Tippy content={tooltip} placement="top">
        <div className={styles.StatusBarItem} style={style}>
          <span>{text}</span>
          {icon.call(null, { ...iconSettings })}
        </div>
      </Tippy>
    );

  return (
    <div className={styles.StatusBarItem} style={style}>
      <span>{text}</span>
      {icon.call(null, { ...iconSettings })}
    </div>
  );
};
