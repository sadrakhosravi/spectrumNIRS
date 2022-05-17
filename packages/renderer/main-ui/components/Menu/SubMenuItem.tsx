import * as React from 'react';

// Styles
import * as styles from './menu.module.scss';

type SubMenuItemProps = {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  accelerator?: string;
};

export const SubMenuItem = ({ text, accelerator, onClick }: SubMenuItemProps) => {
  return (
    <button
      className={styles.SubMenuItem}
      aria-label={text}
      role="menuitem"
      aria-keyshortcuts={accelerator}
      onClick={onClick}
    >
      <span>{text}</span>
      <span>{accelerator || null}</span>
    </button>
  );
};

export const SubMenuItemSeparator = () => {
  return <div className={styles.SubMenuItemSeparator}></div>;
};
