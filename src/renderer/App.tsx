import React from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// CSS
import './App.css';

//Component import
import LoadingIndicator from '@components/Loaders/LoadingIndicator.component';
import useLoadState from 'renderer/startup/useLoadStates';
import TitleBar from './layout/TitleBar/TitleBar.component';
import BottomBar from './layout/BottomBar/BottomBar.component';
import MainNavigation from './layout/MainNavigation/MainNavigation.component';

// import UpdaterUI from '@components/Updater/UpdaterUI.Component';
import IndicatorContainer from '@components/Indicators/IndicatorContainer.component';
import { AppState } from '@utils/constants';

const ModalsContainer = React.lazy(
  () => import('@layout/ModalsContainer/ModalsContainer.component')
);

// Pages
const RouteHandler = React.lazy(() => import('@pages/RouteHandler'));
const ReviewPage = React.lazy(() => import('@pages/Review/Review.page'));

const App = () => {
  useLoadState();

  return (
    <div className="relative h-full w-full">
      <Router>
        <React.Suspense
          fallback={<LoadingIndicator loadingMessage="Initializing..." />}
        >
          <Route path="/main" component={TitleBar} />
          <Route path="/main" component={MainNavigation} />
          <Route path="/main" component={BottomBar} />
          <Route path="/main" component={RouteHandler} />

          {/* <Route path="/dasdasd" component={Clock} /> */}
          <Route path="/main" component={ModalsContainer} />
          <Route path="/main" component={IndicatorContainer} />
          <Route exact path={AppState.REVIEW_TAB}>
            <div className="h-full py-1">
              <ReviewPage />
            </div>
          </Route>

          <Route
            exact
            path="/"
            render={() => <Redirect to={AppState.HOME} />}
          />
          {/* <UpdaterUI /> */}
        </React.Suspense>
      </Router>

      <Toaster
        position="bottom-right"
        containerClassName="mb-6"
        toastOptions={{
          style: { background: '#333333', color: '#fff' },
          className: 'text-white rounded-md',
          duration: 5000,
        }}
      />
    </div>
  );
};

export default App;
