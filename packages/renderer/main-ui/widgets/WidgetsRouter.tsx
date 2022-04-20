import * as React from 'react';
import AppStatesModel from '@models/AppStatesModel';
import { observer } from 'mobx-react-lite';

// Components
import { CalibrationWidgets } from './CalibrationWidgets';

export const WidgetsRouter = observer(() => {
  return (
    <div style={{ paddingRight: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {AppStatesModel.route === 'calibration' && <CalibrationWidgets />}
    </div>
  );
});
