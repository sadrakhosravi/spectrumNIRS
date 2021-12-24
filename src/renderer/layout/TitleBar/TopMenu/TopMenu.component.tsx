// Top Navigation of the app
import React, { useState } from 'react';

import { TopMenu } from './Menu';

// Components
import { Menu } from '@headlessui/react';

// Import top menu and submenu item containers.
import TopMenuButton from './TopMenuButton.component';
import SubMenuItem from '@components/Menu/SubMenuItem.component';

const TopMenuContainer = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  console.log(isMenuOpen);

  return (
    <nav className="inline-block h-40px">
      <ul className="top-menu h-full my-auto ml-3 ">
        {TopMenu.map((menuItem, i) => (
          <Menu as="li" className="h-full inline-block" key={i}>
            <TopMenuButton
              label={menuItem.label}
              onClick={() => setIsMenuOpen(true)}
            />
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
      </ul>
    </nav>
  );
};

export default TopMenuContainer;
