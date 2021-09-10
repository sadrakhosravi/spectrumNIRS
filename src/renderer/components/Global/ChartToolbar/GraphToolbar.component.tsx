import React from 'react';

// Components
import Separator from '@globalComponent/Separator/Separator.component';
import RecordPauseButtons from '@globalComponent/ChartToolbar/RecordPauseButtons';
import ZoomButtons from '@globalComponent/ChartToolbar/ZoomButtons';
import FocusButton from '@globalComponent/ChartToolbar/FocusButton';

const ChartToolbar = () => {
  return (
    <div className="w-full bg-grey1 px-2 h-14 grid gap-3 grid-flow-col grid-cols-2 items-center">
      <div className="grid grid-flow-col auto-cols-max items-center gap-3">
        <ZoomButtons />
        <Separator />
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

export default ChartToolbar;
