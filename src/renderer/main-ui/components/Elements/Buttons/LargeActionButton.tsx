import * as React from 'react';

// Styles
import styles from './largeActionButton.module.scss';

export type LargeActionButtonType = {
  text: string;
  description: string;
  icon: JSX.Element;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const LargeActionButton = ({
  text,
  description,
  icon,
  onClick,
}: LargeActionButtonType) => {
  return (
    <div className={styles.LargeActionButton} tabIndex={1} onClick={onClick}>
      {icon}
      <div>
        <span>{text}</span>
        <span>{description}</span>
      </div>
    </div>
  );
};
