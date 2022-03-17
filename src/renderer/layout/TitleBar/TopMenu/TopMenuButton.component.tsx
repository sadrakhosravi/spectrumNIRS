import React from 'react';

// Components
import { Menu } from '@headlessui/react';

type TopMenuButtonProps = {
  label: string;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined | any;
};

// Renders the Top level menu button
const TopMenuButton = ({ label, onClick }: TopMenuButtonProps) => {
  return (
    <Menu.Button className="h-full z-0 hover:bg-grey3 " onClick={onClick}>
      {({ open }) => (
        <div className={`${open && 'bg-grey3'} px-3 h-full flex items-center`}>
          {label}
        </div>
      )}
    </Menu.Button>
  );
};

export default TopMenuButton;
