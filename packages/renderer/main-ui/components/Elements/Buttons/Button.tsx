import * as React from 'react';

// Styles
import * as styles from './button.module.scss';

type ButtonType = {
  text: string;
  color?: 'primary' | 'green' | 'red';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const Button = ({ text, onClick, color }: ButtonType) => {
  return (
    <button
      className={`${styles.Button} ${
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
