import React from 'react';

//Components
import IconButton from '@globalComponent/IconButton/IconButton.component';

//Icons
import ZoomInIcon from '@icons/zoom-in.svg';
import ZoomOutIcon from '@icons/zoom-out.svg';
import ResetZoom from '@icons/reset-zoom.svg';

const ZoomButtons = () => {
  return (
    <>
      <IconButton text="Zoom In" icon={ZoomInIcon} />
      <IconButton text="Zoom Out" icon={ZoomOutIcon} />
      <IconButton text="Reset Zoom" icon={ResetZoom} />
    </>
  );
};

export default ZoomButtons;
