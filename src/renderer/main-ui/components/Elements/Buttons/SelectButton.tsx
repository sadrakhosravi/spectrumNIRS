import * as React from 'react';

// Styles
import styles from './selectButton.module.scss';

// Icons
import { FiCheckCircle } from 'react-icons/fi';

type SelectButtonProps = {
  text: string;
  isActive?: boolean;
  icon?: JSX.Element;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const SelectButton = ({
  text,
  icon,
  isActive,
  onClick,
}: SelectButtonProps) => {
  return (
    <button
      type="button"
      className={`${styles.SelectButton} ${
        isActive && styles.SelectButtonActive
      }`}
      onClick={onClick}
    >
      <span>
        {icon || null}
        {text}
      </span>
      {isActive && <FiCheckCircle size="16px" />}
    </button>
  );
};
