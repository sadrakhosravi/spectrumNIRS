import * as React from 'react';

// Styles
import styles from './selectableCard.module.scss';

// Icon
import { FiServer } from 'react-icons/fi';

// Types
type SelectableCardType = {
  text: string;
  isSelected?: boolean;
};

export const SelectableCard = ({ text, isSelected }: SelectableCardType) => {
  return (
    <div
      className={`${styles.SelectableCard} ${
        isSelected && styles.SelectableCardSelected
      }`}
    >
      <span>
        <FiServer size="36px" color="#FFF" strokeWidth={1.3} />
      </span>
      <span className="text-larger">{text}</span>
    </div>
  );
};
