import React from 'react';

// Adapter
import { openNewExperimentForm } from '@adapters/dispatchAdapter';

// Headless UI menu dropdown
import { Menu } from '@headlessui/react';

// Components
import TopMenuButton from '../TopMenuButton/TopMenuButton.component';
import SubMenuItem from '../SubMenuItem/SubMenuItem.component';

// File Menu along with its sub menus
const NewMenu = () => {
  return (
    <Menu as="li" className="h-full inline-block">
      {/* Top Menu Button */}
      <TopMenuButton text="New" />
      {/* Sub Menu Items */}
      <Menu.Items className="absolute w-64 mt-0 origin-bottom-left z-50 bg-grey3 shadow-xl py-2">
        <SubMenuItem text="Experiment" onClick={openNewExperimentForm} />
        <SubMenuItem text="Patient" />
        <SubMenuItem text="Recording" />
      </Menu.Items>
    </Menu>
  );
};

export default NewMenu;
