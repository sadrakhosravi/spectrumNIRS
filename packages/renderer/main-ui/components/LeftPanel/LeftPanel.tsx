import React from 'react';

// Styles
import * as styles from './leftPanel.module.scss';

// Components
import { LeftPanelNavButton, LeftPanelActiveIndicator } from './';

// Icons
import { FiActivity, FiSearch, FiTool, FiSettings } from 'react-icons/fi';

// Types
import type { IconType } from 'react-icons/lib';
import { AppNavStatesEnum } from '@utils/types/AppStateEnum';

type NavigationItems = {
  text: string;
  icon: IconType;
  path: AppNavStatesEnum;
};

// Main navigation routes
//TODO: Fix paths
const navigationItems: NavigationItems[] = [
  {
    text: 'Record',
    icon: FiActivity,
    path: AppNavStatesEnum.RECORD,
  },
  {
    text: 'Review',
    icon: FiSearch,
    path: AppNavStatesEnum.REVIEW,
  },
  {
    text: 'Calibration',
    icon: FiTool,
    path: AppNavStatesEnum.CALIBRATION,
  },
];

// Icon constants
const iconSize = 22;
const iconStrokeWidth = 2;
const iconColor = '#b4b4b4';

export const LeftPanel = () => {
  return (
    <div className={styles.LeftPanel}>
      {/* Main navigation */}
      <div className={styles.LeftPanelNavContainer}>
        {navigationItems.map((navItem) => (
          <LeftPanelNavButton
            key={navItem.text + 'nav'}
            text={navItem.text}
            icon={<navItem.icon size={iconSize} strokeWidth={iconStrokeWidth} color={iconColor} />}
            path={navItem.path}
          />
        ))}
      </div>

      <div className={styles.LeftPanelSettingsContainer}>
        <LeftPanelNavButton
          text={'Settings'}
          icon={<FiSettings size={iconSize} strokeWidth={iconStrokeWidth} color={iconColor} />}
        />
      </div>
      <LeftPanelActiveIndicator />
    </div>
  );
};
