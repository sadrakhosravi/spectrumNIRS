import React from 'react';
import { Menu } from '@headlessui/react';

// Constants
import { colors } from '@utils/colors';

// Icons
import ChevronDownIcon from '@icons/chevron-down.svg';

type ColorPickerProps = {
  color: string;
  setColor: (color: string) => void;
};

const ColorPicker = ({ color = '#FFF', setColor }: ColorPickerProps) => {
  return (
    <Menu as="div" className="relative inline-block text-left h-8 w-24 pr-2">
      <Menu.Button
        as="button"
        className="flex items-center gap-1 hover:bg-dark rounded-md"
      >
        <div className="w-8 h-8 rounded-sm" style={{ background: color }}></div>
        <img src={ChevronDownIcon} className="w-4" alt="Arrow Down" />
      </Menu.Button>
      <Menu.Items
        as="ul"
        className="absolute top-10 left-0 grid grid-cols-4 gap-3 items-center flex-wrap px-4 py-4 w-48 bg-dark2 border-primary rounded-md drop-shadow-xl z-20"
      >
        {colors.map((color) => (
          <Menu.Item
            as="li"
            className="w-full h-8 hover:scale-[1.15] cursor-pointer rounded-sm"
            style={{ background: color.value }}
            onClick={() => setColor(color.value)}
            key={color.value + 'color-picker'}
          ></Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};
export default ColorPicker;
