import React from 'react';

//Components
import IconButton from '@globalComponent/IconButton/IconButton.component';
import Seperator from '@globalComponent/Seperator/Seperator.component';

//Icons
import ZoomInIcon from '@icons/zoom-in.svg';
import ZoomOutIcon from '@icons/zoom-out.svg';
import ResetZoom from '@icons/reset-zoom.svg';
import FocusModeIcon from '@icons/focus-mode.svg';
import RecordIcon from '@icons/record.svg';
import PauseIcon from '@icons/pause.svg';

const GraphToolbar = () => {
  return (
    <div className="w-full bg-grey1 px-2 h-14 grid gap-3 grid-flow-col grid-cols-2 items-center">
      <div className="grid grid-flow-col auto-cols-max items-center gap-3">
        <IconButton text="Zoom In" icon={ZoomInIcon} />
        <IconButton text="Zoom Out" icon={ZoomOutIcon} />
        <IconButton text="Reset Zoom" icon={ResetZoom} />

        <Seperator />
        <IconButton text="Focus Mode" icon={FocusModeIcon} />
      </div>

      {/* Stop Start Button */}
      <div className="grid grid-flow-col auto-cols-max items-center gap-3 justify-end">
        <div className="grid grid-flow-col auto-cols-max gap-3">
          <IconButton text="Record" icon={RecordIcon} darker={true} />
          <IconButton text="Pause" icon={PauseIcon} darker={true} />
        </div>
      </div>
    </div>
  );
};

export default GraphToolbar;
