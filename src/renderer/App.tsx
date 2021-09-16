import React from 'react';

import './App.global.css';

// App state constants
import { appStateEnum } from './ts/appStateEnum';

// Module import
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//Component import
import TitleBar from './components/TitleBar/TitleBar.component';
import BottomBar from './components/BottomBar/BottomBar.component';
import MainNavigation from './components/MainNavigation/MainNavigation.component';

import PageRouter from '@pages/index';

function App() {
  return (
    <Router>
      {/* Static Components */}
      <TitleBar />
      <BottomBar />
      <MainNavigation />

      {/* Dynamic Component */}
      <Switch>
        <Route
          exact
          path={`/${appStateEnum.home}`}
          render={() => {
            return <PageRouter page={appStateEnum.home} />;
          }}
        />
        <Route
          exact
          path={`/${appStateEnum.record}`}
          render={() => <PageRouter page={appStateEnum.record} />}
        />
        <Route
          exact
          path={`/${appStateEnum.review}`}
          render={() => <PageRouter page={appStateEnum.review} />}
        />
      </Switch>
    </Router>
  );
}

export default App;
