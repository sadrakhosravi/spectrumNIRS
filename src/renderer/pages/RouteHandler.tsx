import React from 'react';
import { HashRouter as Router, Route, useLocation } from 'react-router-dom';
import useNavigation from '@hooks/useNavigation.hook';

// Pages
import HomePage from './Home/Home.page';

// Webview
import ChartWebView from './ChartWebView';
// Components
import Tabs from '@components/Tabs/Tabs.component';

// Constants
import { AppState } from '@utils/constants';

const RouteHandler = () => {
  const location = useLocation();
  useNavigation();

  return (
    <main className="main-container">
      <Router>
        <Route exact path={AppState.HOME} component={HomePage} />
        <Route path={AppState.RECORDING} component={Tabs} />
      </Router>
      <div
        className="fit-to-container absolute top-[40px] left-0 w-full h-full"
        hidden={!location.pathname.includes('record')}
      >
        <ChartWebView />
      </div>
    </main>
  );
};
export default RouteHandler;
