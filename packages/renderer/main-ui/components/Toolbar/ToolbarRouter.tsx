import * as React from 'react';
import { observer } from 'mobx-react-lite';
import AppStatesModel from '@models/AppStatesModel';

// Toolbars
import { CalibrationToolbar } from '/@/views/Calibration';

export const ToolbarRouter = observer(() => {
  return <>{AppStatesModel.route === 'calibration' && <CalibrationToolbar />}</>;
});
