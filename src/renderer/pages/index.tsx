import React from 'react';

// Router import
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

// AppState Enum
import { AppState } from 'utils/constants';

// Containers
import HomePage from '@pages/Home/Home.page';
import RouteHandler from './RouteHandler';
import ModalsContainer from '@layout/ModalsContainer/ModalsContainer.component';
import Tabs from '@components/Tabs/Tabs.component';

// Pages

const PageRouter: React.FC = () => {
  return (
    <main className="main-container">
      <div className="relative h-full">
        <React.Suspense fallback={<p>Loading ...</p>}>
          <Router>
            <ModalsContainer />
            <Route path={`/main/recording`} component={Tabs} />
            <Switch>
              <Route exact path={`${AppState.HOME}`} component={HomePage} />
            </Switch>

            <RouteHandler />
          </Router>
        </React.Suspense>
      </div>
    </main>
  );
};

export default PageRouter;
