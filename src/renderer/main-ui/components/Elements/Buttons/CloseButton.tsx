import * as React from 'react';

// Styles
import styles from './closeButton.module.scss';

// Icons
import { FiX } from 'react-icons/fi';

type CloseButtonType = {
  className?: string;

  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const CloseButton = ({ className, onClick }: CloseButtonType) => {
  return (
    <button
      className={`${styles.CloseButton} ${className || ''}`}
      onClick={onClick}
      title="Close"
    >
      <FiX strokeWidth={3} size="22px" />
    </button>
  );
};
