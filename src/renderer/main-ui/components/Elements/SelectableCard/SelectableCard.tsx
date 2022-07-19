import * as React from 'react';

// Styles
import styles from './selectableCard.module.scss';

// Icon
import { FiServer } from 'react-icons/fi';

// Types
type SelectableCardType = {
  text: string;
  value: string;
  setter: (value: any) => void;
  isSelected?: boolean;
};

export const SelectableCard = ({
  text,
  setter,
  value,
  isSelected,
}: SelectableCardType) => {
  return (
    <button
      type="button"
      onClick={() => setter(value)}
      className={`${styles.SelectableCard} ${
        isSelected && styles.SelectableCardSelected
      }`}
    >
      <span>
        <FiServer size="36px" color="#FFF" strokeWidth={1.3} />
      </span>
      <span className="text-larger">{text}</span>
    </button>
  );
};
