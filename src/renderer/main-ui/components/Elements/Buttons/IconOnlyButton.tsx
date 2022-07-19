import * as React from 'react';
import Tippy from '@tippyjs/react';

// Styles
import styles from './button.module.scss';

type IconOnlyButtonType = {
  icon: JSX.Element;
  className?: string;
  isActive?: boolean;
  isInteractiveActive?: boolean;
  tooltipText?: string;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const IconOnlyButton = ({
  icon,
  isActive,
  tooltipText,
  tooltipPlacement,
  isInteractiveActive,
  className,
  onClick,
}: IconOnlyButtonType) => {
  return (
    <>
      {tooltipText ? (
        <Tippy content={tooltipText} placement={tooltipPlacement || 'bottom'}>
          <button
            className={`${styles.IconOnlyButton} ${
              isActive && styles.IconOnlyButtonActive
            } ${className}`}
            onClick={onClick}
          >
            {icon}
          </button>
        </Tippy>
      ) : (
        <button
          className={`${styles.IconOnlyButton} ${
            isActive && styles.IconOnlyButtonActive
          } ${
            isInteractiveActive && styles.IconOnlyButtonActiveInteractive
          } ${className}`}
          onClick={onClick}
        >
          {icon}
        </button>
      )}
    </>
  );
};
