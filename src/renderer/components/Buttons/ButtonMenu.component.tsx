import React from 'react';
import { Menu, Transition } from '@headlessui/react';

// Icons
import ChevronDownIcon from '@icons/chevron-down.svg';

type ButtonMenuProps = {
  text?: string | number | undefined;
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
            className={`border-primary z-0 inline-flex w-full items-center justify-between gap-1 rounded-md  bg-grey2 px-2 py-1.5 text-sm font-medium text-white duration-150  hover:bg-grey1 active:ring-2 active:ring-accent ${
              open && 'ring-2 ring-accent'
            } ${className}`}
            style={{ width }}
          >
            {icon && <img src={icon} className="w-6" />}
            {text && text}
            <img
              className={`ml-1 w-3 duration-150 ${open && 'rotate-180'}`}
              src={ChevronDownIcon}
            />
          </Menu.Button>
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-150"
            enterFrom="transform translate-y-2 opacity-0 scale-65"
            enterTo="transform translate-y-0 opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="transform translate-y-0 opacity-100 scale-100"
            leaveTo="transform translate-y-2 opacity-0 scale-65"
          >
            <Menu.Items
              className={`border-primary absolute right-0 z-40 mt-1 max-h-56 min-w-[10rem] origin-top-right overflow-y-auto rounded-md bg-grey3 p-1.5 text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
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
  text?: string | number;
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
          } group flex  w-full items-center gap-1 rounded-md px-2 py-[0.35rem] text-sm text-white transition-colors duration-150 focus:ring-2 focus:ring-accent`}
        >
          {icon && <img src={icon} className="w-4" />}
          {text && text}
        </button>
      )}
    </Menu.Item>
  );
};
