import * as React from 'react';

// Styles
import * as styles from './button.module.scss';

type ButtonType = {
  text: string;
  color?: 'primary' | 'green' | 'red';
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const Button = ({ text, onClick, className, color }: ButtonType) => {
  return (
    <button
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
