import React from 'react';

// Headless UI menu dropdown
import { Menu } from '@headlessui/react';

// Import top menu and submenu item containers.
import TopMenuButton from '../TopMenuButton/TopMenuButton.component';
import SubMenuItem from '../SubMenuItem/SubMenuItem.component';

// File Menu along with its submenus
const NewMenu = () => {
  return (
    <Menu as="li" className="h-full inline-block">
      {/* Top Menu Button */}
      <TopMenuButton text="New" />
      {/* Sub Menu Items */}
      <Menu.Items className="absolute w-64 mt-0 origin-bottom-left z-50 bg-grey3 shadow-xl py-2">
        <SubMenuItem text="Patient" />
        <SubMenuItem text="Experiment" />
      </Menu.Items>
    </Menu>
  );
};

export default NewMenu;
