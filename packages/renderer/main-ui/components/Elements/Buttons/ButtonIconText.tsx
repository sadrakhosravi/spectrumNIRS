import * as React from 'react';

// Styles
import * as styles from './button.module.scss';

// Icons
import { FiChevronDown } from 'react-icons/fi';

type ButtonIconText = {
  icon: JSX.Element;
  text: string;
  className?: string;
  buttonRef?: React.LegacyRef<HTMLButtonElement>;
  dropDownIndicator?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const ButtonIconText = ({
  icon,
  text,
  className,
  buttonRef,
  dropDownIndicator,
  disabled,
  onClick,
}: ButtonIconText) => {
  return (
    <button
      className={`${styles.Button} ${styles.IconTextButton} ${className || ''}`}
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {text}
      {dropDownIndicator && <FiChevronDown size="12px" />}
    </button>
  );
};
