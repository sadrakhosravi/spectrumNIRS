// Top Navigation of the app
import React from 'react';

import { TopMenu } from './Menu';

// Components
import { Menu } from '@headlessui/react';

// Import top menu and submenu item containers.
import TopMenuButton from './TopMenuButton.component';
import SubMenuItem from '@components/Menu/SubMenuItem.component';
import MenuSeparator from '@components/Separator/MenuSeparator.component';
import Utilities from 'renderer/UIModels/Utilities';

const TopMenuContainer = (): JSX.Element => {
  return (
    <nav className="inline-block h-[30px]">
      <ul className="top-menu my-auto h-full ">
        {TopMenu.map((menuItem, i) => (
          <Menu as="li" className="inline-block h-full" key={i}>
            <TopMenuButton label={menuItem.label} onClick={undefined} />
            <Menu.Items className="absolute z-50 mt-0 w-72 origin-bottom-left bg-grey3 py-2 shadow-xl">
              {menuItem.submenu.map((submenu, i) =>
                submenu.label === 'separator' ? (
                  <MenuSeparator key={i + 'top-menu'} />
                ) : (
                  <SubMenuItem
                    label={submenu.label}
                    onClick={() =>
                      submenu.checkRecording
                        ? Utilities.checkIfRecordingActive(submenu.click)
                        : submenu.click || undefined
                    }
                    key={submenu.label}
                  />
                )
              )}
            </Menu.Items>
          </Menu>
        ))}
      </ul>
    </nav>
  );
};

export default TopMenuContainer;
