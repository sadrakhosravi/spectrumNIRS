import React from 'react';

import HomeIconButton from './IconButtons/HomeIconButton.component';
import SignalIconButton from './IconButtons/SignalIconButton.component';
import ReviewIconButton from './IconButtons/ReviewIconButton.component';

import styles from './MainNavigation.module.css';

const MainNavigation = () => {
  return (
    <div className={`${styles.MainNavigation} text-center`}>
      <HomeIconButton fill="#FFF" />
      <SignalIconButton />
      <ReviewIconButton />
    </div>
  );
};

export default MainNavigation;
