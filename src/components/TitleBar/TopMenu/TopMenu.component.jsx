//Top Navigation of the app
import React from 'react';

import styles from './TopMenu.module.css';

const TopMenu = () => {
  return (
    <nav className="inline-block">
      <ul className={styles.TopMenu}>
        <li>File</li>
        <li>Help</li>
        <li>DevTools</li>
      </ul>
    </nav>
  );
};

export default TopMenu;
