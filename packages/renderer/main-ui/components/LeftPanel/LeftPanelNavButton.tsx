import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { appRouterVM } from '@store';

// Styles
import * as styles from './leftPanel.module.scss';

// Types
import { AppNavStatesEnum } from '@utils/types/AppStateEnum';

type LeftPanelNavButtonProps = {
  text: string;
  icon: JSX.Element;
  path?: AppNavStatesEnum;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const LeftPanelNavButton = observer(
  ({ text, icon, path, onClick }: LeftPanelNavButtonProps) => {
    return (
      <button
        tabIndex={1}
        className={`${styles.LeftPanelNavButton} ${
          appRouterVM.route === path && styles.LeftPanelNavButton_Active
        }`}
        onClick={() => (path ? appRouterVM.navigateTo(path) : onClick)}
      >
        {icon}
        <span>{text}</span>
      </button>
    );
  },
);
