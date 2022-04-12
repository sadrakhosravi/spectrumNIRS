import * as React from 'react';
import { observer } from 'mobx-react-lite';
import AppStatesModel from '@models/AppStatesModel';

// Styles
import * as styles from './leftPanel.module.scss';

// The height nav buttons
const navButtonHeight = 70;

export const LeftPanelActiveIndicator = observer(() => {
  const [topPos, setTopPos] = React.useState(0);

  React.useEffect(() => {
    switch (AppStatesModel.route) {
      case '':
        setTopPos(0);
        break;

      case 'record':
        setTopPos(navButtonHeight);
        break;

      case 'review':
        setTopPos(navButtonHeight * 2);
        break;

      default:
        break;
    }
  }, [AppStatesModel.route]);

  return <div className={`${styles.LeftPanelActiveIndicator}`} style={{ top: topPos }}></div>;
});
