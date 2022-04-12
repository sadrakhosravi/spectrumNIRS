import * as React from 'react';
import { observer } from 'mobx-react-lite';

import AppRoutes from '../../../../models/AppRoutes';

// Styles
import * as styles from './leftPanel.module.scss';

type LeftPanelNavButtonProps = {
  text: string;
  icon: JSX.Element;
  path: string;
};

export const LeftPanelNavButton = observer(({ text, icon, path }: LeftPanelNavButtonProps) => {
  console.log(AppRoutes.route);
  return (
    <button className={styles.LeftPanelNavButton} onClick={() => AppRoutes.setRoute('test')}>
      {icon}
      <span>{text}</span>
    </button>
  );
});
