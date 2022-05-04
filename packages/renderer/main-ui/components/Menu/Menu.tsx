import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { appMenuVM } from '@store';

// Styles
import * as styles from './menu.module.scss';

// Modules
import { MenuItem, SubMenu, SubMenuItem } from './';

export const Menu = observer(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={styles.MenuContainer}>
      {appMenuVM.menu.map((menuItem) => (
        <MenuItem
          text={menuItem.label}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          key={menuItem.label + 'menu'}
        >
          <>
            {menuItem.submenu && (
              <SubMenu>
                {menuItem.submenu.map((subMenuItem) => (
                  <SubMenuItem
                    text={subMenuItem.label}
                    key={subMenuItem.label + subMenuItem.accelerator}
                  />
                ))}
              </SubMenu>
            )}
          </>
        </MenuItem>
      ))}
    </div>
  );
});
