import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import useNavigation from '@hooks/useNavigation.hook';

// Pages
const HomePage = React.lazy(() => import('@pages/Home/Home.page'));
const RecordPage = React.lazy(() => import('@pages/Record/Record.page'));
const ReviewPage = React.lazy(() => import('@pages/Review/Review.page'));
const ProbeCalibrationPage = React.lazy(
  () => import('@pages/ProbeCalibration/ProbeCalibration.page')
);
const ExportServerPage = React.lazy(
  () => import('@pages/ExportServer/ExportServer.page')
);

// Constants
import { AppState } from '@utils/constants';

const RouteHandler = () => {
  useNavigation();

  return (
    <main className="main-container z-40 flex">
      <Router>
        <React.Suspense fallback={'Loading ...'}>
          <Switch>
            <Route exact path={AppState.HOME} component={HomePage} />
            <Route
              exact
              path={AppState.EXPORT_SERVER}
              component={ExportServerPage}
            />
            <Route
              exact
              path={AppState.PROBE_CALIBRATION}
              component={ProbeCalibrationPage}
            />

            <Route exact path={AppState.RECORD} component={RecordPage} />
            <Route exact path={AppState.REVIEW} component={ReviewPage} />
          </Switch>
        </React.Suspense>
      </Router>
    </main>
  );
};
export default RouteHandler;
