import * as React from 'react';
import { Listbox as ListboxUI } from '@headlessui/react';

// Styles
import * as styles from './listbox.module.scss';

// Icons
import { FiChevronDown, FiCheck } from 'react-icons/fi';

type OptionsType = {
  name: string;
  value: number | string;
};

type ListboxType = {
  options: OptionsType[];
  setter: (value: any) => void;
  value: OptionsType;
};

const iconSize = 16;

export const Listbox = ({ options, value, setter }: ListboxType) => {
  const listBoxRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="w-full relative">
      <ListboxUI value={value.name} onChange={setter}>
        <ListboxUI.Button ref={listBoxRef} className={styles.ListboxButton}>
          {value.name} <FiChevronDown />
        </ListboxUI.Button>

        <ListboxUI.Options className={styles.ListboxOptionsContainer}>
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
