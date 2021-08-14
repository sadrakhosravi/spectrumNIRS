import React from 'react';

import styles from './MainContainer.module.css';
import StartupContainer from './StartupScreen/StartupContainer.component';

const MainContainer = () => {
  return (
    <main className={styles.MainContainer}>
      <StartupContainer />
    </main>
  );
};

export default MainContainer;
