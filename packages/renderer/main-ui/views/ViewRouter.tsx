import * as React from 'react';
import { observer } from 'mobx-react-lite';
import AppStatesModel from '@models/AppStatesModel';

// Views
import { HomeScreen } from './';

export const ViewRouter = observer(() => {
  return <div className="h-full w-full">{AppStatesModel.route === '' && <HomeScreen />}</div>;
});
