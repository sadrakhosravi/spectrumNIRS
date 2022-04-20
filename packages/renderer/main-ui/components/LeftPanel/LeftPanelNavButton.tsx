import * as React from 'react';
import { observer } from 'mobx-react-lite';
import AppStatesModel from '../../../../models/AppStatesModel';
import { AppStatesViewModel } from '@viewmodels/index';

// Styles
import * as styles from './leftPanel.module.scss';

// Types
import { AppNavStates } from '@utils/types/AppStateTypes';

type LeftPanelNavButtonProps = {
  text: string;
  icon: JSX.Element;
  path: AppNavStates;
};

export const LeftPanelNavButton = observer(({ text, icon, path }: LeftPanelNavButtonProps) => {
  return (
    <button
      tabIndex={1}
      className={`${styles.LeftPanelNavButton} ${
        AppStatesModel.route === path && styles.LeftPanelNavButton_Active
      }`}
      onClick={() => AppStatesViewModel.navigateTo(path)}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
});
