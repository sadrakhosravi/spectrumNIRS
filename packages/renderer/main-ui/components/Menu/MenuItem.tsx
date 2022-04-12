import React, { useEffect, useRef, useState } from 'react';

// Styles
import * as styles from './menu.module.scss';

// Hooks

type MenuItemProps = {
  text: string;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: JSX.Element;
};

export const MenuItem = ({ text, isMenuOpen, setIsMenuOpen, children }: MenuItemProps) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuItemClick = () => {
    if(isMenuOpen && isSubMenuOpen) {
      setIsSubMenuOpen(false);
      setIsMenuOpen(false);
      return;
    } 

    setIsSubMenuOpen(true);
    setIsMenuOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | KeyboardEvent) => {
      menuRef.current && !menuRef.current.contains(event.target as any) && setIsSubMenuOpen(false);
    };

    if (isSubMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleClickOutside);
    };
  }, [isSubMenuOpen]);

  return (
    <div
      className={`${styles.MenuItem} ${isSubMenuOpen && styles.MenuItemActive}`}
      aria-label={text}
      role="menuitem"
      aria-haspopup
      ref={menuRef}
      onMouseEnter={() => isMenuOpen && handleMenuItemClick()}
      onMouseLeave={() => isMenuOpen && setIsSubMenuOpen(false)}
      onClick={handleMenuItemClick}
    >
      {text}
      {isSubMenuOpen && <div>{children}</div>}
    </div>
  );
};
