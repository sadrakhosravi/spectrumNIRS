import React from 'react';

// Router import
import { MemoryRouter as Router, Route, Switch } from 'react-router-dom';

// AppState Enum
import { AppState } from 'utils/constants';

// Containers
import HomePage from '@pages/Home/Home.page';
import ReviewPage from '@pages/Review/Review.page';
import RouteHandler from './RouteHandler';
import ModalsContainer from '@layout/ModalsContainer/ModalsContainer.component';
import ChartToolbar from 'renderer/Chart/ChartToolbar/GraphToolbar.component';
import Tabs from '@components/Tabs/Tabs.component';

const PageRouter: React.FC = () => {
  return (
    <main className="main-container">
      <div className="relative h-full">
        <Router>
          <ModalsContainer />
          <Switch>
            <Route path={`/recording`} component={Tabs} />
            <Route path={`/recording`} component={ChartToolbar} />
          </Switch>
          <Switch>
            <Route exact path={`/${AppState.HOME}`} component={HomePage} />
            <Route exact path={`/${AppState.RECORD}`} component={ReviewPage} />
            <Route exact path={`/${AppState.REVIEW}`} component={ReviewPage} />
          </Switch>

          <RouteHandler />
        </Router>
      </div>
    </main>
  );
};

export default PageRouter;
