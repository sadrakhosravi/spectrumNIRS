//Top Navigation of the app
import React from 'react';

import styles from './TopMenu.module.css';

const TopMenu = () => {
  return (
    <nav className="inline-block">
      <ul className={`${styles.TopMenu} ml-3`}>
        <li className="hover:bg-light2">File</li>
        <li className="hover:bg-light2">Help</li>
        <li className="hover:bg-light2">DevTools</li>
      </ul>
    </nav>
  );
};

export default TopMenu;
