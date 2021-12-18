import React from 'react';

// Tooltip
import Tooltip from '@components/Tooltip/Tooltip.component';

const ProbeCalibrationButton = (props: any) => {
  const { isActive, onClick } = props;
  // Check if the button is active and set the styling accordingly
  let activeClass;
  if (isActive) {
    activeClass = 'icon-button-active';
  } else {
    activeClass = '';
  }

  return (
    <Tooltip text="Probe Calibration" placement="right">
      <button
        type="button"
        className={`icon-button ${activeClass}`}
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="3.1rem"
          height="3.1rem"
        >
          <g>
            <path d="M 15 4 L 15 12 L 7 12 L 7 11 L 5 11 L 5 26 L 3 26 L 3 28 L 29 28 L 29 26 L 27 26 L 27 4 L 25 4 L 25 5 L 17 5 L 17 4 Z M 17 7 L 25 7 L 25 26 L 17 26 Z M 7 14 L 15 14 L 15 26 L 7 26 Z M 7 14 " />
          </g>
        </svg>
      </button>
    </Tooltip>
  );
};

export default ProbeCalibrationButton;
