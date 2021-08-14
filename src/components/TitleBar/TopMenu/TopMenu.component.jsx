//Top Navigation of the app
import React from 'react';

import styles from './TopMenu.module.css';

const TopMenu = () => {
  return (
    <nav className="inline-block">
      <ul className={`${styles.TopMenu} ml-3`}>
        <li className="hover:bg-accent">File</li>
        <li className="hover:bg-accent">Help</li>
        <li className="hover:bg-accent">DevTools</li>
      </ul>
    </nav>
  );
};

export default TopMenu;
