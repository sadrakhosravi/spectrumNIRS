import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { appMenuVM } from '@store';

// Styles
import styles from './menu.module.scss';

// Modules
import { MenuItem, SubMenu, SubMenuItem } from './';
import { Separator } from '../Elements/Separator';

export const Menu = observer(() => {
  return (
    <div className={styles.MenuContainer}>
      {appMenuVM.menu.map((menuItem) => (
        <MenuItem
          text={menuItem.label}
          id={menuItem.id}
          key={menuItem.id + 'menu'}
        >
          <>
            {menuItem.submenu && (
              <SubMenu>
                {menuItem.submenu.map((subMenuItem) =>
                  subMenuItem.label === 'Separator' ? (
                    <Separator key={React.useId()} gap="1rem" />
                  ) : (
                    <SubMenuItem
                      text={subMenuItem.label}
                      accelerator={subMenuItem.shortcutKeys}
                      key={subMenuItem.id}
                      onClick={() => subMenuItem.onClick()}
                    />
                  )
                )}
              </SubMenu>
            )}
          </>
        </MenuItem>
      ))}
    </div>
  );
});
