//Top Navigation of the app
import React from 'react';

//Used for dropdown menu
import { Menu } from '@headlessui/react';

import styles from './TopMenu.module.css';

const TopMenu = () => {
  return (
    <nav className="inline-block fixed top-0">
      <ul className={`${styles.TopMenu} ml-3`}>
        <Menu as="d" className="relative">
          <Menu.Button>
            <li className="hover:bg-light2">File</li>
          </Menu.Button>
          <Menu.Items className="absolute left-0 w-56  origin-top-right focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <a className={`${active && 'bg-blue-500'}`} href="/account-settings">
                  Account settings
                </a>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
        <li className="hover:bg-light2">Help</li>
        <li className="hover:bg-light2">DevTools</li>
      </ul>
    </nav>
  );
};

export default TopMenu;
