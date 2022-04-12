import * as React from 'react';

// Styles
import * as styles from './menu.module.scss';

type SubMenuItemProps = {
  text: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  shortcut?: string;
};

export const SubMenuItem = ({ text, shortcut, onClick }: SubMenuItemProps) => {
  return (
    <div
      className={styles.SubMenuItem}
      aria-label={text}
      role="menuitem"
      aria-keyshortcuts={shortcut}
      onClick={onClick}
    >
      <span>{text}</span>
      <span>{shortcut || null}</span>
    </div>
  );
};

export const SubMenuItemSeparator = () => {
  return <div className={styles.SubMenuItemSeparator}></div>;
};
