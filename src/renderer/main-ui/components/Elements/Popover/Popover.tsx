import * as React from 'react';
import { Dialog } from '@headlessui/react';

// Styles
import styles from './popover.module.scss';

// Icons
import { FiX } from 'react-icons/fi';

type PopoverType = {
  buttonRef: HTMLButtonElement;
  title?: string;
  children: React.ReactNode;
  height?: number;
  closeSetter: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Popover = ({
  buttonRef,
  title,
  height,
  children,
  closeSetter,
}: PopoverType) => {
  const popoverHeight = height || 250;

  const buttonSize = buttonRef.getBoundingClientRect();
  const topMargin = 15;
  let top = buttonSize.top + buttonSize.height + topMargin;
  let left = buttonSize.left - 45;
  let flip = false;

  // Get viewport popoverHeight and flip the indicator if needed
  const windowHeight = window.innerHeight;
  if (top + popoverHeight > windowHeight - 15) {
    top = buttonSize.y - popoverHeight - topMargin;
    flip = true;
  }

  return (
    <Dialog open={true} onClose={() => closeSetter(false)}>
      <div
        className={styles.Popover}
        style={{ top, left, height: popoverHeight }}
      >
        {/* The triangle indicator */}
        <span
          className={
            flip
              ? styles.PopoverTriangleIndicatorBottom
              : styles.PopoverTriangleIndicatorTop
          }
        />
        <button
          className={styles.PopoverCloseBtn}
          onClick={() => closeSetter(false)}
          title="Close"
        >
          <FiX strokeWidth={3} size="20px" />
        </button>
        <div className={styles.Title}>{title}</div>

        <div className={styles.PopoverContentArea}>{children}</div>
      </div>
      <div
        className="overlay-transparent"
        onClick={() => closeSetter(false)}
      ></div>
    </Dialog>
  );
};
