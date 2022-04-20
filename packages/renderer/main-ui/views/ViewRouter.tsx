import * as React from 'react';
import { observer } from 'mobx-react-lite';
import AppStatesModel from '@models/AppStatesModel';

// Views
import { HomeView } from './';
import { ScreenView } from './ScreenView';

export const ViewRouter = observer(() => {
  return (
    <div className="h-full w-full">
      {AppStatesModel.route === '' && <HomeView />}{' '}
      {AppStatesModel.route !== '' && <ScreenView enableWidgets />}
    </div>
  );
});
