import React from 'react';

import './App.global.css';

//Component import
import TitleBar from './components/TitleBar/TitleBar.component';
import BottomBar from './components/BottomBar/BottomBar.component';
import MainNavigation from './components/MainNavigation/MainNavigation.component';

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
