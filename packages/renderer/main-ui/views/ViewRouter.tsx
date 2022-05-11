import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { appRouterVM } from '@store';

// Views
import { HomeView } from './Home';
import { ScreenView } from './ScreenView';

export const ViewRouter = observer(() => {
  return (
    <div className="h-full w-full">
      {appRouterVM.route === '' && <HomeView />}
      {appRouterVM.route !== '' && <ScreenView enableWidgets />}
    </div>
  );
});
