import * as React from 'react';

// Styles
import styles from './menu.module.scss';

type SubMenuProps = {
  children: React.ReactNode;
};

export const SubMenu = ({ children }: SubMenuProps) => {
  return <div className={styles.SubMenu}>{children}</div>;
};
