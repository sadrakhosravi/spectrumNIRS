import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import './App.global.css';

// Constants
import { AppState } from '@utils/constants';

//Component import
import TitleBar from './layout/TitleBar/TitleBar.component';
import BottomBar from './layout/BottomBar/BottomBar.component';
import MainNavigation from './layout/MainNavigation/MainNavigation.component';
import PageRouter from '@pages/index';
import RecordPage from '@pages/Record/Record.page';

const App = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return <Redirect to="/main/home" />;
            }}
          />
        </Switch>
        <Switch>
          <Route
            exact
            path={`/tabs/recording/record`}
            render={() => <RecordPage />}
          />
        </Switch>
        <Route exact path={`/tabs/${AppState.RECORD}`} component={RecordPage} />
        <Route path="/main" component={TitleBar} />
        <Route path="/main" component={MainNavigation} />
        <Route path="/main" component={BottomBar} />
        <PageRouter />
      </Router>
    </>
  );
};

export default App;
