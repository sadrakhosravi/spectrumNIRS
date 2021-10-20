import React from 'react';

import './App.global.css';

//Component import
import TitleBar from './layout/TitleBar/TitleBar.component';
import BottomBar from './layout/BottomBar/BottomBar.component';
import MainNavigation from './layout/MainNavigation/MainNavigation.component';

import PageRouter from '@pages/index';

function App() {
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
