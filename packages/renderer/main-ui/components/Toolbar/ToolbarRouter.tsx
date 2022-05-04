import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { appRouterVM } from '@store';

// Components
import { Toolbar } from './Toolbar';

// Toolbars
import { CalibrationToolbar } from '/@/views/Calibration';

export const ToolbarRouter = observer(() => {
  return <Toolbar>{appRouterVM.route === 'calibration' && <CalibrationToolbar />}</Toolbar>;
});
