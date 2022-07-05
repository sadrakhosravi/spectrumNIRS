import * as React from 'react';
import Tippy from '@tippyjs/react';

// Styles
import styles from './toolbar.module.scss';

type ToolbarButtonType = {
  icon: JSX.Element;
  tooltipText: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const ToolbarButton = ({
  icon,
  tooltipText,
  onClick,
}: ToolbarButtonType) => {
  return (
    <Tippy content={tooltipText} placement="bottom">
      <button className={styles.ToolbarButton} onClick={onClick}>
        {icon}
      </button>
    </Tippy>
  );
};
