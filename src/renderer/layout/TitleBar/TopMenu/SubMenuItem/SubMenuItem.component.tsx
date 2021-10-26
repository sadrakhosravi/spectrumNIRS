import React from 'react';

// Menu from headless UI
import { Menu } from '@headlessui/react';

type SubMenuItemProps = {
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

// Renders Headless UI sub menu item
const SubMenuItem = ({ label, onClick }: SubMenuItemProps): JSX.Element => {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          type="button"
          className={`${
            active ? 'bg-accent' : ''
          } text-white py-0.5 mb-0.5 px-6 w-full text-left text-base`}
          onClick={onClick}
        >
          {label}
        </button>
      )}
    </Menu.Item>
  );
};

export default SubMenuItem;
