import React, { useEffect, useState } from 'react';
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
import LoadingIndicator from '@components/Loaders/LoadingIndicator.component';

import TitleBar from './layout/TitleBar/TitleBar.component';
import BottomBar from './layout/BottomBar/BottomBar.component';
import MainNavigation from './layout/MainNavigation/MainNavigation.component';
import FirstLoader from '@components/Loaders/FirstLoader.component';
import UpdaterUI from '@components/Updater/UpdaterUI.Component';

const Clock = React.lazy(() => import('@components/Clock/Clock.component'));

const ModalsContainer = React.lazy(
  () => import('@layout/ModalsContainer/ModalsContainer.component')
);

// Pages
const RouteHandler = React.lazy(() => import('@pages/RouteHandler'));
const ReviewPage = React.lazy(() => import('@pages/Review/Review.page'));

const App = () => {
  const [firstLoader, setFirstLoader] = useState(true);

  useEffect(() => {
    window.api.onIPCData('update-spectrum', (_, data) => {
      console.log(data);
    });
    setTimeout(async () => {
      setFirstLoader(false);
    }, 1000);
  }, []);

  return (
    <div className="relative h-full w-full">
      {firstLoader && <FirstLoader />}
      <Router>
        <React.Suspense
          fallback={<LoadingIndicator loadingMessage="Initializing..." />}
        >
          <Route path="/main" component={TitleBar} />
          <Route path="/main" component={RouteHandler} />
          <Route path="/main" component={MainNavigation} />
          <Route path="/main" component={BottomBar} />
          <Route path="/main" component={Clock} />
          <Route path="/main" component={ModalsContainer} />
          <Route exact path={AppState.REVIEW_TAB}>
            <div className="h-full py-1">
              <ReviewPage />
            </div>
          </Route>

          <Route
            path={'/main'}
            render={() => (
              <Toaster
                position="bottom-right"
                containerClassName="mb-6"
                toastOptions={{
                  style: { background: '#333333', color: '#fff' },
                  className: 'text-white rounded-md',
                  duration: 5000,
                }}
              />
            )}
          />
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/main" />} />
          </Switch>
          <UpdaterUI />
        </React.Suspense>
      </Router>
    </div>
  );
};

export default App;
