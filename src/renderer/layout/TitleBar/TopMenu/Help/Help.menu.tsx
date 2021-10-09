import React from 'react';

// Headless UI menu dropdown
import { Menu } from '@headlessui/react';

// Components
import TopMenuButton from '../TopMenuButton/TopMenuButton.component';
import SubMenuItem from '../SubMenuItem/SubMenuItem.component';

// File Menu along with its sub menus
const HelpMenu = () => {
  return (
    <Menu as="li" className="h-full inline-block">
      {/* Top Menu Button */}
      <TopMenuButton text="Help" />
      {/* Sub Menu Items */}
      <Menu.Items className="absolute w-64 mt-0 origin-bottom-left z-50 bg-grey3 shadow-xl py-2">
        <SubMenuItem text="About" />
      </Menu.Items>
    </Menu>
  );
};

export default HelpMenu;
