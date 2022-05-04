import * as React from 'react';

// Styles
import * as styles from './tabs.module.scss';

// Types
type TabButtonType = {
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  style?: React.CSSProperties;
  topBorder?: boolean;
  isActive?: boolean;
};

export const TabButton = ({ text, isActive, style, onClick }: TabButtonType) => {
  return (
    <button
      type="button"
      className={`${styles.TabButton} ${isActive && styles.TabButtonActive}`}
      onClick={onClick}
      id={text}
      style={style}
    >
      {text}
    </button>
  );
};
