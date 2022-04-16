import * as React from 'react';
import AppStatesModel from '@models/AppStatesModel';
import { observer } from 'mobx-react-lite';

// Components
import { CalibrationWidgets } from './CalibrationWidgets';

export const WidgetsRouter = observer(() => {
  return <>{AppStatesModel.route === 'calibration' && <CalibrationWidgets />}</>;
});
