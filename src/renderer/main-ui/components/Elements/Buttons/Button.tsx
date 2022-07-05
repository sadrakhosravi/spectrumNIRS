import * as React from 'react';

// Styles
import styles from './button.module.scss';

type ButtonType = {
  text: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const Button = ({
  text,
  type,
  disabled,
  className,
  onClick,
}: ButtonType) => {
  return (
    <button
      type={type || 'button'}
      className={`${styles.Button} ${className || ''}  ${
        disabled ? styles.disabled : ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
