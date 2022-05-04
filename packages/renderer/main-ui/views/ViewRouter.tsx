import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { appRouterVM } from '@store';

// Views
const HomeView = React.lazy(() => import('./Home/HomeView'));
const ScreenView = React.lazy(() => import('./ScreenView/ScreenView'));

export const ViewRouter = observer(() => {
  return (
    <div className="h-full w-full">
      {appRouterVM.route === '' && <HomeView />}
      {appRouterVM.route !== '' && <ScreenView enableWidgets />}
    </div>
  );
});
