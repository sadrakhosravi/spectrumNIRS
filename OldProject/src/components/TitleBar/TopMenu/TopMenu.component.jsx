//Top Navigation of the app
import React from 'react';

import styles from './TopMenu.module.css';

//Menu from headless UI
import { Menu } from '@headlessui/react';

//Menu import
import FileMenu from './File/File.menu';

const TopMenu = () => {
  return (
    <nav className="inline-block absolute top-0 h-full">
      <ul className={`${styles.TopMenu} h-full my-auto ml-3`}>
        <FileMenu />
      </ul>
    </nav>
  );
};

export default TopMenu;
