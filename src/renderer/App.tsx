import React from 'react';

import './App.global.css';
// Module import
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// //Component import
import TitleBar from './components/TitleBar/TitleBar.component';
import BottomBar from './components/BottomBar/BottomBar.component';
import MainNavigation from './components/MainNavigation/MainNavigation.component';
import MainContainer from '@container/MainContainer.component';

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
          path="/home"
          render={() => {
            return <MainContainer container="startContainer" />;
          }}
        />
        <Route
          exact
          path="/record"
          render={() => <MainContainer container="recordContainer" />}
        />
      </Switch>
    </Router>
  );
}

export default App;
