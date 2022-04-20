import * as React from 'react';
import { observer } from 'mobx-react-lite';
import AppStatesModel from '@models/AppStatesModel';

// Components
import { Toolbar } from './Toolbar';

// Toolbars
import { CalibrationToolbar } from '/@/views/Calibration';

export const ToolbarRouter = observer(() => {
  return <Toolbar>{AppStatesModel.route === 'calibration' && <CalibrationToolbar />}</Toolbar>;
});
