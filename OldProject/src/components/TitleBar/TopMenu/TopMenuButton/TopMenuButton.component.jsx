import React from 'react';

import { Menu } from '@headlessui/react';

//Renders the Top level menu button
const TopMenuButton = props => {
  const { text } = props;
  return (
    <Menu.Button className="h-full z-0 hover:bg-grey3 ">
      {({ open }) => <button className={`${open && 'bg-grey3'} px-2 h-full`}>{text}</button>}
    </Menu.Button>
  );
};

export default TopMenuButton;
