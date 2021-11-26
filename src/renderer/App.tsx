import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// CSS
import './App.css';

// Constants
import { AppState } from '@utils/constants';

//Component import
import LoadingIndicator from '@components/LoadingIndicator/LoadingIndicator.component';

import TitleBar from './layout/TitleBar/TitleBar.component';
import BottomBar from './layout/BottomBar/BottomBar.component';
import MainNavigation from './layout/MainNavigation/MainNavigation.component';

const ModalsContainer = React.lazy(
  () => import('@layout/ModalsContainer/ModalsContainer.component')
);
import RouteHandler from '@pages/RouteHandler';

// Pages
const ReviewPage = React.lazy(() => import('@pages/Review/Review.page'));

// Test
// import ReviewWebView from '@pages/Review/ReviewWebView';

const App = () => {
  return (
    <div className="relative h-full w-full">
      <Router>
        <React.Suspense
          fallback={<LoadingIndicator loadingMessage="Initializing..." />}
        >
          <Route path="/main" component={RouteHandler} />
          <Route path="/main" component={MainNavigation} />
          <Route path="/main" component={BottomBar} />
          <Route path="/main" component={TitleBar} />
          <Route path="/main" component={ModalsContainer} />
          <Route exact path={AppState.REVIEW_TAB} component={ReviewPage} />
          <Route
            path={'/main'}
            render={() => (
              <Toaster
                position="bottom-right"
                containerClassName="mb-6"
                toastOptions={{
                  className: 'bg-grey2 text-white rounded-md',
                  duration: 5000,
                }}
              />
            )}
          />
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/main" />} />
          </Switch>
        </React.Suspense>
      </Router>
    </div>
  );
};

export default App;
