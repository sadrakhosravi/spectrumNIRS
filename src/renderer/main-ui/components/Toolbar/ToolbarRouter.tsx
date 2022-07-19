import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { appRouterVM } from '@store';

// Components
import { Toolbar } from './Toolbar';

// Toolbars
import { CalibrationToolbar } from '/@/views/Calibration';
import { AppNavStatesEnum } from '@utils/types/AppStateEnum';
import { ReviewToolbar } from '/@/views/Review/Toolbar/ReviewToolbar';

export const ToolbarRouter = observer(() => {
  return (
    <Toolbar>
      {(appRouterVM.route === AppNavStatesEnum.CALIBRATION ||
        appRouterVM.route === AppNavStatesEnum.RECORD) && (
        <CalibrationToolbar />
      )}
      {appRouterVM.route === AppNavStatesEnum.REVIEW && <ReviewToolbar />}
    </Toolbar>
  );
});
