//Controls the header/Titlebar of the app - Electron laods a frameless window.

import React from 'react';
import { useSelector } from 'react-redux';

//Components
import Logo from '@globalComponent/Logo/Logo.component';
import TopMenu from './TopMenu/TopMenu.component';
import WindowButtons from './WindowButtons/WindowButtons.component';

//Styles
import styles from './TitleBar.module.css';

const TitleBar = () => {
  const appState = useSelector(state => state.appState.value);

  return (
    <header className={`${styles.TitleBar} header-container items-center grid grid-cols-3 bg-grey1`}>
      <div className="grid grid-cols-12 items-center align-middle">
        <span className="col-span-1">
          <Logo />
        </span>
        <span className="col-span-11">
          <TopMenu />
        </span>
      </div>
      <div>{appState !== 'home' && <p className="text-center">File Name</p>}</div>
      <WindowButtons />
    </header>
  );
};

export default TitleBar;
