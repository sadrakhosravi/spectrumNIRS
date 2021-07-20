import React from 'react';

import { ReactComponent as HomeIcon } from '../../assets/icons/home.svg';
import SignalIcon from '../../assets/icons/signal.svg';
import ReviewIcon from '../../assets/icons/review.svg';

import styles from './MainNavigation.module.css';

const MainNavigation = () => {
  return (
    <div className={`${styles.MainNavigation} text-center`}>
      <ul className="inline-block pt-5">
        <li className={styles.Icon}>
          <HomeIcon />
        </li>
      </ul>
    </div>
  );
};

export default MainNavigation;
