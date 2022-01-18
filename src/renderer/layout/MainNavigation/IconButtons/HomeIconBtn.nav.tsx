import React from 'react';

// Tooltip
import Tooltip from '@components/Tooltip/Tooltip.component';

const HomeIconButton = (props: any) => {
  const { isActive, onClick } = props;
  let isDisabled = true;

  return (
    <Tooltip text="Home" placement="right">
      <button
        type="button"
        className={`icon-button ${
          isActive && 'icon-button-active bg-white bg-opacity-5'
        }`}
        onClick={onClick}
        disabled={isDisabled}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="2.4rem"
          height="2.4rem"
        >
          <g>
            <path d="M 15.96875 2.667969 C 15.753906 2.675781 15.550781 2.75 15.382812 2.882812 L 5.90625 10.347656 C 4.703125 11.292969 4 12.742188 4 14.273438 L 4 27 C 4 27.910156 4.757812 28.667969 5.667969 28.667969 L 12.332031 28.667969 C 13.242188 28.667969 14 27.910156 14 27 L 14 20.332031 C 14 20.136719 14.136719 20 14.332031 20 L 17.667969 20 C 17.863281 20 18 20.136719 18 20.332031 L 18 27 C 18 27.910156 18.757812 28.667969 19.667969 28.667969 L 26.332031 28.667969 C 27.242188 28.667969 28 27.910156 28 27 L 28 14.273438 C 28 12.742188 27.296875 11.292969 26.09375 10.347656 L 16.617188 2.882812 C 16.433594 2.734375 16.203125 2.660156 15.96875 2.667969 Z M 16 4.941406 L 24.855469 11.917969 C 25.578125 12.488281 26 13.355469 26 14.273438 L 26 26.667969 L 20 26.667969 L 20 20.332031 C 20 19.058594 18.941406 18 17.667969 18 L 14.332031 18 C 13.058594 18 12 19.058594 12 20.332031 L 12 26.667969 L 6 26.667969 L 6 14.273438 C 6 13.355469 6.421875 12.488281 7.144531 11.917969 Z M 16 4.941406 " />
          </g>
        </svg>
      </button>
    </Tooltip>
  );
};

export default HomeIconButton;
