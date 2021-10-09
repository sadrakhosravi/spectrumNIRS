import React from 'react';

//Components
import IconButton from '@components/Buttons/IconButton.component';

// HOC
import withTooltip from 'renderer/hoc/withTooltip.hoc';

//Icons
import ZoomInIcon from '@icons/zoom-in.svg';
import ZoomOutIcon from '@icons/zoom-out.svg';
import ResetZoom from '@icons/reset-zoom.svg';

const ZoomInButton = withTooltip(IconButton, 'Zoom In');
const ZoomOutButton = withTooltip(IconButton, 'Zoom Out');
const ResetZoomButton = withTooltip(IconButton, 'Rest Zoom');

const ZoomButtons = () => {
  return (
    <>
      <ZoomInButton icon={ZoomInIcon} />
      <ZoomOutButton icon={ZoomOutIcon} />
      <ResetZoomButton icon={ResetZoom} />
    </>
  );
};

export default ZoomButtons;
