import React from 'react';
import { AppStatesController } from '@controllers/AppStatesController';

// Styles
import * as styles from './leftPanel.module.scss';

// Components
import { LeftPanelNavButton, LeftPanelActiveIndicator } from './';

// Icons
import { FiActivity, FiHome, FiSearch, FiTool } from 'react-icons/fi';

// Types
import type { IconType } from 'react-icons/lib';
import type { AppNavStates } from '@utils/types/AppStateTypes';

type NavigationItems = {
  text: string;
  icon: IconType;
  path: AppNavStates;
};

// Main navigation routes
const navigationItems: NavigationItems[] = [
  {
    text: 'Home',
    icon: FiHome,
    path: '',
  },
  {
    text: 'Record',
    icon: FiActivity,
    path: 'record',
  },
  {
    text: 'Review',
    icon: FiSearch,
    path: 'review',
  },
  {
    text: 'Calibration',
    icon: FiTool,
    path: 'calibration',
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

      <div className={styles.LeftPanelSettingsContainer}></div>
      <LeftPanelActiveIndicator />
    </div>
  );
};
