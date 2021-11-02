import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

// CSS
import './App.global.css';

// Constants
import { AppState } from '@utils/constants';

//Component import
import TitleBar from './layout/TitleBar/TitleBar.component';
import BottomBar from './layout/BottomBar/BottomBar.component';
import MainNavigation from './layout/MainNavigation/MainNavigation.component';
const ModalsContainer = React.lazy(
  () => import('@layout/ModalsContainer/ModalsContainer.component')
);
const Tabs = React.lazy(() => import('@components/Tabs/Tabs.component'));
import RouteHandler from '@pages/RouteHandler';

// Pages
const HomePage = React.lazy(() => import('@pages/Home/Home.page'));
const RecordPage = React.lazy(() => import('@pages/Record/Record.page'));
const ReviewPage = React.lazy(() => import('@pages/Review/Review.page'));

const App = () => {
  return (
    <div className="relative h-full w-full">
      <Router>
        <React.Suspense fallback={<p>Loading ... </p>}>
          <Route path="/main" component={RouteHandler} />
          <Route path="/main" component={MainNavigation} />
          <Route path="/main" component={BottomBar} />
          <Route path="/main" component={TitleBar} />
          <Route path="/main" component={ModalsContainer} />

          <main className="main-container">
            <Route path={AppState.RECORDING} component={Tabs} />

            <Route exact path={AppState.HOME} component={HomePage} />

            <div className="fit-to-container">
              <Route exact path={AppState.RECORD} component={RecordPage} />
              <Route exact path={AppState.REVIEW} component={ReviewPage} />
            </div>
          </main>

          <Switch>
            <Route exact path="/" render={() => <Redirect to="/main" />} />

            <Route exact path={AppState.REVIEW_TAB} component={ReviewPage} />
          </Switch>
        </React.Suspense>
      </Router>
    </div>
  );
};

export default App;
