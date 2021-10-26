// Top Navigation of the app
import React from 'react';

import { TopMenu } from './Menu';

// Components
import { Menu } from '@headlessui/react';

// Import top menu and submenu item containers.
import TopMenuButton from './TopMenuButton/TopMenuButton.component';
import SubMenuItem from './SubMenuItem/SubMenuItem.component';

// Menu import
// import FileMenu from './File/File.menu';
// import HelpMenu from './Help/Help.menu';
// import NewMenu from './New/New.menu';

const TopMenuContainer = (): JSX.Element => {
  return (
    <nav className="inline-block h-40px">
      <ul className="top-menu h-full my-auto ml-3 ">
        {TopMenu.map((menuItem, i) => (
          <Menu as="li" className="h-full inline-block" key={i}>
            <TopMenuButton label={menuItem.label} />
            <Menu.Items className="absolute w-72 mt-0 origin-bottom-left z-50 bg-grey3 shadow-xl py-2">
              {menuItem.submenu.map((submenu) => (
                <SubMenuItem
                  label={submenu.label}
                  onClick={submenu.click || undefined}
                  key={submenu.label}
                />
              ))}
            </Menu.Items>
          </Menu>
        ))}

        {/* <FileMenu />
        <NewMenu />
        <HelpMenu /> */}
      </ul>
    </nav>
  );
};

export default TopMenuContainer;
