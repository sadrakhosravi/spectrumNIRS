import React from 'react';

// Styles
import * as styles from './leftPanel.module.scss';

// Components
import { LeftPanelNavButton } from './';

// Icons
import { FiActivity, FiHome, FiSearch, FiSettings } from 'react-icons/fi';

// Main navigation routes
const navigationItems = [
  {
    text: 'Home',
    icon: FiHome,
    path: '/',
  },
  {
    text: 'Record',
    icon: FiActivity,
    path: '/',
  },
  {
    text: 'Review',
    icon: FiSearch,
    path: '/review',
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
          text="Settings"
          icon={<FiSettings size={iconSize} strokeWidth={iconStrokeWidth} color={iconColor} />}
          path={'/settings'}
        />
      </div>
    </div>
  );
};
