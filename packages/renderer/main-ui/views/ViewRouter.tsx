import * as React from 'react';
import { observer } from 'mobx-react-lite';
import AppStatesModel from '@models/AppStatesModel';

// Views
const HomeView = React.lazy(() => import('./Home/HomeView'));
const ScreenView = React.lazy(() => import('./ScreenView/ScreenView'));

export const ViewRouter = observer(() => {
  return (
    <div className="h-full w-full">
      {AppStatesModel.route === '' && <HomeView />}{' '}
      {AppStatesModel.route !== '' && <ScreenView enableWidgets />}
    </div>
  );
});
