import React from 'react';

import './App.global.css';

//Component import
import TitleBar from './layout/TitleBar/TitleBar.component';
import BottomBar from './layout/BottomBar/BottomBar.component';
import MainNavigation from './layout/MainNavigation/MainNavigation.component';

import PageRouter from '@pages/index';

const ipcInvoke = window.api.invokeIPC;

function App() {
  const test = async () => {
    const ipc = ipcInvoke('testing', ['test']);
    console.log(ipc);
  };

  test();
  return (
    <>
      {/* Static Components */}
      <TitleBar />
      <BottomBar />
      <MainNavigation />
      <PageRouter />
    </>
  );
}

export default App;
