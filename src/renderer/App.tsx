import React from 'react';

import './App.global.css';

// App state constants
import { appStateConstants } from './constants/Constants';

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
          path={`/${appStateConstants.home}`}
          render={() => {
            return <PageRouter page={appStateConstants.home} />;
          }}
        />
        <Route
          exact
          path={`/${appStateConstants.record}`}
          render={() => <PageRouter page={appStateConstants.record} />}
        />
        <Route
          exact
          path={`/${appStateConstants.review}`}
          render={() => <PageRouter page={appStateConstants.review} />}
        />
      </Switch>
    </Router>
  );
}

export default App;
