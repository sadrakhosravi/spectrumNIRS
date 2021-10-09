import React from 'react';

// Router import
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

// AppState Enum
import { AppState } from '@constants/constants';

// Containers
import HomePage from '@pages/Home/Home.page';
import RecordPage from '@pages/Record/Record.page';
import ReviewPage from '@pages/Review/Review.page';
import RouteHandler from './RouteHandler';
import ModalsContainer from '@layout/ModalsContainer/ModalsContainer.component';

const PageRouter: React.FC = () => {
  return (
    <main className="main-container">
      <div className="relative h-full">
        <Router>
          <ModalsContainer />
          <Switch>
            <Route exact path={`/${AppState.HOME}`} component={HomePage} />
            <Route exact path={`/${AppState.RECORD}`} component={RecordPage} />
            <Route exact path={`/${AppState.REVIEW}`} component={ReviewPage} />
          </Switch>
          <RouteHandler />
        </Router>
      </div>
    </main>
  );
};

export default PageRouter;
