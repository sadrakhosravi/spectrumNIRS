import React from 'react';

// Router import
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

// AppState Enum
import { AppState } from 'renderer/constants/Constants';

// Containers
import HomePage from '@pages/Home/Home.page';
import RecordPage from '@pages/Record/Record.page';
import ReviewPage from '@pages/Review/Review.page';
import RouteHandler from './RouteHandler';

const PageRouter: React.FC = () => {
  return (
    <main className="main-container">
      <Router>
        <Switch>
          <Route exact path={`/${AppState.HOME}`} component={HomePage} />
          <Route exact path={`/${AppState.RECORD}`} component={RecordPage} />
          <Route exact path={`/${AppState.REVIEW}`} component={ReviewPage} />
        </Switch>
        <RouteHandler />
      </Router>
    </main>
  );
};

export default PageRouter;
