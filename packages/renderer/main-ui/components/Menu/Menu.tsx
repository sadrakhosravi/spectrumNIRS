import React, { useState } from 'react';

// Styles
import * as styles from './menu.module.scss';

// Modules
import { MenuItem, SubMenu, SubMenuItem, SubMenuItemSeparator } from './';

export const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={styles.MenuContainer}>
      <MenuItem text="Test" isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}>
        <SubMenu>
          <SubMenuItem text="Test" shortcut="Ctrl + R" />
          <SubMenuItem text="Test" shortcut="Ctrl + R" />
          <SubMenuItemSeparator />

          <SubMenuItem text="Test" />
        </SubMenu>
      </MenuItem>
      <MenuItem text="Test" isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}>
        <SubMenu>
          <SubMenuItem text="Test" shortcut="Ctrl + R" />
          <SubMenuItem text="Test" shortcut="Ctrl + R" />
          <SubMenuItemSeparator />

          <SubMenuItem text="Test" />
        </SubMenu>
      </MenuItem>
    </div>
  );
};
