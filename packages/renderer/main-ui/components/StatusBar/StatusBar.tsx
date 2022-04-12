import * as React from 'react';

// Styles
import * as styles from './statusBar.module.scss';

// Components
import { StatusBarItem } from './';

// Icon
import { FiAirplay } from 'react-icons/fi';

export const StatusBar = () => {
  return (
    <footer className={styles.StatusBar}>
      <div className={styles.LeftItems}>
        <StatusBarItem icon={<FiAirplay size={16} strokeWidth={2.5} />} text="Test" />
      </div>
      <div className={styles.RightItems}>
        <StatusBarItem icon={<FiAirplay size={16} strokeWidth={2.5} />} text="Test" />
        <StatusBarItem icon={<FiAirplay size={16} strokeWidth={2.5} />} text="Test" />

        <StatusBarItem icon={<FiAirplay size={16} strokeWidth={2.5} />} text="Test" />
      </div>
    </footer>
  );
};
