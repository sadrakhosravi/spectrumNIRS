import * as React from 'react';

import { appRouterVM } from '@store';
import { observer } from 'mobx-react-lite';

// Components
import { CalibrationWidgets } from './CalibrationWidgets';

export const WidgetsRouter = observer(() => {
  return (
    <div
      style={{
        paddingRight: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {(appRouterVM.route === 'calibration' ||
        appRouterVM.route === 'record') && <CalibrationWidgets />}
    </div>
  );
});
