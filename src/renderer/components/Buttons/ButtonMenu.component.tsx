import React from 'react';
import { Menu, Transition } from '@headlessui/react';

// Icons
import ChevronDownIcon from '@icons/chevron-down.svg';

type ButtonMenuProps = {
  text?: string;
  icon?: string;
  children: JSX.Element | JSX.Element[];
};

const ButtonMenu = ({ text, icon, children }: ButtonMenuProps) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button
              as="button"
              className={`inline-flex gap-1 justify-center items-center w-full text-sm font-medium px-2 py-1.5 text-white bg-grey2 hover:bg-grey1 border-primary rounded-md  duration-150 active:ring-2 active:ring-accent ${
                open && 'ring-2 ring-accent'
              }`}
            >
              {icon && <img src={icon} className="w-6" />}
              {text && text}
              <img
                className={`ml-1 duration-150 w-3 ${open && 'rotate-180'}`}
                src={ChevronDownIcon}
              />
            </Menu.Button>
          </div>
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-75"
            enterFrom="transform opacity-0 scale-65"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 min-w-[10rem] mt-1 origin-top-right p-1.5 bg-grey3 border-primary text-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {children}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};
export default ButtonMenu;

type ButtonMenuItemProps = {
  text?: string;
  icon?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined | any;
};

export const ButtonMenuItem = ({
  text,
  icon,
  onClick,
}: ButtonMenuItemProps) => {
  return (
    <Menu.Item onClick={onClick}>
      {({ active }) => (
        <button
          className={`${
            active ? 'bg-grey1 ' : ''
          } group text-sm  text-white flex gap-1 items-center w-full px-2 py-[0.35rem] rounded-md transition-colors duration-150 focus:ring-2 focus:ring-accent`}
        >
          {icon && <img src={icon} className="w-4" />}
          {text && text}
        </button>
      )}
    </Menu.Item>
  );
};
