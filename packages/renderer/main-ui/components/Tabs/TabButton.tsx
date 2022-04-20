import * as React from 'react';

// Styles
import * as styles from './tabs.module.scss';

// Types
type TabButtonType = {
  text: string;
  topBorder?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isActive?: boolean;
};

export const TabButton = ({ text, isActive, onClick }: TabButtonType) => {
  return (
    <button
      type="button"
      className={`${styles.TabButton} ${isActive && styles.TabButtonActive}`}
      onClick={onClick}
      id={text}
    >
      {text}
    </button>
  );
};
