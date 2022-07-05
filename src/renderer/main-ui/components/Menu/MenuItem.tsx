import { observer } from 'mobx-react-lite';
import * as React from 'react';

// Styles
import styles from './menu.module.scss';

// View Model
import { appMenuVM } from '@store';

type MenuItemProps = {
  text: string;
  id: string;
  children: JSX.Element;
};

export const MenuItem = observer(({ text, id, children }: MenuItemProps) => {
  const menuRef = React.useRef<HTMLDivElement>(null);

  const handleMenuItemClick = React.useCallback(() => {
    if (appMenuVM.currSubMenu === id) {
      appMenuVM.setCurrSubMenuOpen('');
      return;
    }
    appMenuVM.setCurrSubMenuOpen(id);
  }, [appMenuVM.currSubMenu]);

  // Detect click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent | KeyboardEvent) => {
      menuRef.current &&
        !menuRef.current.contains(event.target as any) &&
        appMenuVM.setCurrSubMenuOpen('');
    };

    if (appMenuVM.currSubMenu === id) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleClickOutside);
    };
  }, [appMenuVM.currSubMenu]);

  return (
    <div
      className={`${styles.MenuItem} ${
        appMenuVM.currSubMenu === id && styles.MenuItemActive
      }`}
      aria-label={text}
      role="menuitem"
      aria-haspopup
      ref={menuRef}
      onClick={() => handleMenuItemClick()}
      onMouseEnter={() =>
        appMenuVM.currSubMenu && appMenuVM.setCurrSubMenuOpen(id)
      }
    >
      {text}
      {appMenuVM.currSubMenu === id && <div>{children}</div>}
    </div>
  );
});
