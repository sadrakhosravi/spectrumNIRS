import React from 'react';

//Menu from headless UI
import { Menu } from '@headlessui/react';

//Renders Headless UI sub menu item
const SubMenuItem = props => {
  const { text, onClick } = props;

  return (
    <Menu.Item>
      {({ active }) => (
        <button
          className={`${active ? 'bg-accent' : ''} text-white py-0.5 mb-0.5 px-6 w-full text-left text-base`}
          onClick={onClick}
        >
          {text}
        </button>
      )}
    </Menu.Item>
  );
};

export default SubMenuItem;
