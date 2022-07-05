import * as React from 'react';

// Styles
import styles from './button.module.scss';

// Icons
import { FiChevronDown } from 'react-icons/fi';

type ButtonIconTextType = {
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
}: ButtonIconTextType) => {
  return (
    <button
      type="button"
      className={`${styles.Button} ${styles.IconTextButton} ${className || ''}`}
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      title={disabled ? 'This button is disabled' : undefined}
    >
      {icon}
      {text}
      {dropDownIndicator && <FiChevronDown size="12px" />}
    </button>
  );
};
