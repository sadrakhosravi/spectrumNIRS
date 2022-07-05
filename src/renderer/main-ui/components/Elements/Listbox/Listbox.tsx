import * as React from 'react';
import { Listbox as ListboxUI } from '@headlessui/react';

// Styles
import styles from './listbox.module.scss';

// Icons
import { FiChevronDown, FiCheck } from 'react-icons/fi';

type OptionsType = {
  name: string;
  value: number | string;
};

type ListboxType = {
  options: OptionsType[];
  value: OptionsType;
  /**
   * Height of the list box option container in pixels.
   */
  height?: number;
  setter: (value: any) => void;
  onChange?: (value: string) => void;
};

const iconSize = 16;

export const Listbox = ({
  options,
  value,
  height,
  setter,
  onChange,
}: ListboxType) => {
  return (
    <div className="w-full relative">
      <ListboxUI
        value={value.name}
        onChange={(value: string) => {
          setter(value);
          onChange && setTimeout(() => onChange(value), 1);
        }}
      >
        <ListboxUI.Button className={styles.ListboxButton}>
          {value.name} <FiChevronDown />
        </ListboxUI.Button>

        <ListboxUI.Options
          className={styles.ListboxOptionsContainer}
          style={{ height: height ? `${height}px` : undefined }}
        >
          {options.map((option, i) => (
            <ListboxUI.Option key={option.name + i} value={option}>
              {option.name}
              {option.name === value.name && <FiCheck size={iconSize} />}
            </ListboxUI.Option>
          ))}
        </ListboxUI.Options>
      </ListboxUI>
    </div>
  );
};
