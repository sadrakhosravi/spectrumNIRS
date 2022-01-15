import React from 'react';
import { Menu, Transition } from '@headlessui/react';

// Icons
import ChevronDownIcon from '@icons/chevron-down.svg';

type ButtonMenuProps = {
  text?: string;
  icon?: string;
  className?: string;
  width?: string;
  children: JSX.Element | JSX.Element[];
};

const ButtonMenu = ({
  text,
  icon,
  className = '',
  width,
  children,
}: ButtonMenuProps) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <Menu.Button
            as="button"
            className={`inline-flex gap-1 items-center justify-between w-full text-sm font-medium px-2 py-1.5 text-white bg-grey2 hover:bg-grey1 border-primary rounded-md  duration-150 active:ring-2 active:ring-accent ${
              open && 'ring-2 ring-accent'
            } ${className}`}
            style={{ width }}
          >
            {icon && <img src={icon} className="w-6" />}
            {text && text}
            <img
              className={`ml-1 duration-150 w-3 ${open && 'rotate-180'}`}
              src={ChevronDownIcon}
            />
          </Menu.Button>
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-300"
            enterFrom="transform translate-y-2 opacity-0 scale-65"
            enterTo="transform translate-y-0 opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="transform translate-y-0 opacity-100 scale-100"
            leaveTo="transform translate-y-2 opacity-0 scale-65"
          >
            <Menu.Items
              className="absolute right-0 min-w-[10rem] mt-1 origin-top-right p-1.5 bg-grey3 border-primary text-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-40
              "
              style={{ width }}
            >
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
