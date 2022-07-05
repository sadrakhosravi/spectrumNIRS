import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { appRouterVM } from '@store';

// Styles
import styles from './leftPanel.module.scss';

// The height nav buttons
const navButtonHeight = 70;

export const LeftPanelActiveIndicator = observer(() => {
  const [topPos, setTopPos] = React.useState(0);

  React.useEffect(() => {
    switch (appRouterVM.route) {
      case 'record':
        setTopPos(0);
        break;

      case 'review':
        setTopPos(navButtonHeight * 1);
        break;

      case 'calibration':
        setTopPos(navButtonHeight * 2);
        break;

      default:
        break;
    }
  }, [appRouterVM.route]);

  return (
    <div
      className={`${styles.LeftPanelActiveIndicator}`}
      style={{ top: topPos }}
    ></div>
  );
});
