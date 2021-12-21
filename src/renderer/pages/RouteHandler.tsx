import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, useLocation } from 'react-router-dom';
import useNavigation from '@hooks/useNavigation.hook';

// Pages
import HomePage from './Home/Home.page';
const RecordPage = React.lazy(() => import('@pages/Record/Record.page'));
const ReviewPage = React.lazy(() => import('@pages/Review/Review.page'));
const ProbeCalibrationPage = React.lazy(
  () => import('@pages/ProbeCalibration/ProbeCalibration.page')
);

// Webview
// import ChartWebView from './ChartWebView';
// Components
import Tabs from '@components/Tabs/AppTabs.component';

// Constants
import { AppState } from '@utils/constants';

const RouteHandler = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const location = useLocation();
  console.log(location);
  useNavigation();

  useEffect(() => {
    setTimeout(() => {
      setIsHidden(true);
      setFirstLoad(false);
    }, 1000);
  }, []);

  useEffect(() => {
    location.pathname.includes('recording') && setIsHidden(false);
    !location.pathname.includes('recording') && !firstLoad && setIsHidden(true);
  }, [location]);

  return (
    <main className="main-container">
      <React.Suspense fallback={'Loading ...'}>
        <Router>
          <Route exact path={AppState.HOME} component={HomePage} />
          <Route
            exact
            path={AppState.PROBE_CALIBRATION}
            component={ProbeCalibrationPage}
          />
          <Route path={AppState.RECORDING} component={Tabs} />
        </Router>
        <div
          className="fit-to-container absolute top-[40px] left-0 w-full h-full"
          hidden={isHidden}
        >
          <RecordPage />
          <ReviewPage />
        </div>
      </React.Suspense>
    </main>
  );
};
export default RouteHandler;
