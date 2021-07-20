import React from 'react';

import TrayIcons from './TrayIcons/TrayIcons.component';

import styles from './BottomBar.module.css';

const BottomBar = () => {
  return (
    <div className={`${styles.BottomBar} grid grid-cols-12 items-center bg-accent text-base`}>
      <p className="ml-2 col-span-3">Software Version: 0.0.1</p>
      <TrayIcons />
    </div>
  );
};

export default BottomBar;
