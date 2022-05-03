import * as React from 'react';

// Styles
import * as styles from './popover.module.scss';

// Icons
import { FiX } from 'react-icons/fi';

type PopoverType = {
  buttonRef: HTMLButtonElement;
  title?: string;
  children: React.ReactNode;
  closeSetter: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Popover = ({ buttonRef, title, children, closeSetter }: PopoverType) => {
  const height = 250;

  const buttonSize = buttonRef.getBoundingClientRect();
  const topMargin = 15;
  let top = buttonSize.top + buttonSize.height + topMargin;
  let left = buttonSize.left - 45;
  let flip = false;

  // Get viewport height and flip the indicator if needed
  const windowHeight = window.innerHeight;
  if (top + height > windowHeight - 15) {
    top = buttonSize.y - height - topMargin;
    flip = true;
  }

  // Close the popup on Escape key press
  React.useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      e.key === 'Escape' && closeSetter(false);
    };
    document.addEventListener('keydown', onKeyPress);

    return () => {
      document.removeEventListener('keydown', onKeyPress);
    };
  }, []);

  return (
    <>
      <div className={styles.Popover} style={{ top, left, height }}>
        {/* The triangle indicator */}
        <span
          className={
            flip ? styles.PopoverTriangleIndicatorBottom : styles.PopoverTriangleIndicatorTop
          }
        />
        <button className={styles.PopoverCloseBtn} onClick={() => closeSetter(false)} title="Close">
          <FiX strokeWidth={3} size="20px" />
        </button>
        <div className={styles.Title}>{title}</div>

        <div className={styles.PopoverContentArea}>{children}</div>
      </div>
      <div className="overlay-transparent" onClick={() => closeSetter(false)}></div>
    </>
  );
};
