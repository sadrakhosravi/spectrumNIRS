import * as React from 'react';

// Styles
import * as styles from './button.module.scss';

type ButtonType = {
  text: string;
  color?: 'primary' | 'green' | 'red';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const Button = ({ text, type, className, color, onClick }: ButtonType) => {
  return (
    <button
      type={type || 'button'}
      className={`${styles.Button} ${className || ''} ${
        color === 'primary'
          ? styles.ButtonPrimary
          : color === 'green'
          ? styles.ButtonGreen
          : color === 'red'
          ? styles.ButtonRed
          : ''
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
