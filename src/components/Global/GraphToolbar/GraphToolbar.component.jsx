import React from 'react';

//Components
import Seperator from '@globalComponent/Seperator/Seperator.component';
import RecordPauseButtons from '@globalComponent/GraphToolbar/RecordPauseButtons';
import ZoomButtons from '@globalComponent/GraphToolbar/ZoomButtons';
import FocusButton from '@globalComponent/GraphToolbar/FocusButton';

const GraphToolbar = () => {
  return (
    <div className="w-full bg-grey1 px-2 h-14 grid gap-3 grid-flow-col grid-cols-2 items-center">
      <div className="grid grid-flow-col auto-cols-max items-center gap-3">
        <ZoomButtons />
        <Seperator />
        <FocusButton />
      </div>

      {/* Stop Start Button */}
      <div className="grid grid-flow-col auto-cols-max items-center gap-3 justify-end">
        <div className="grid grid-flow-col auto-cols-max gap-3">
          <RecordPauseButtons />
        </div>
      </div>
    </div>
  );
};

export default GraphToolbar;
