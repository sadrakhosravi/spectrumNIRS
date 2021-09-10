import React from 'react';

// Tooltip
import Tooltip from '@tooltip';

const ReviewIconButton = (props: any) => {
  const { isActive, onClick } = props;

  // Check if the button is active and set the styling accordingly
  let activeClass;
  if (isActive) {
    activeClass = 'icon-button-active';
  } else {
    activeClass = '';
  }

  return (
    <Tooltip text="Review" placement="right">
      <button
        type="button"
        className={`icon-button ${activeClass}`}
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="3rem"
          height="3rem"
        >
          <g>
            <path d="M 13 3 C 7.484375 3 3 7.484375 3 13 C 3 18.515625 7.484375 23 13 23 C 15.398438 23 17.601562 22.148438 19.324219 20.738281 L 27.292969 28.707031 L 28.707031 27.292969 L 20.738281 19.324219 C 21.953125 17.84375 22.75 16.007812 22.953125 14 L 28 14 L 28 12 L 16.617188 12 L 13.929688 6.625 L 10.808594 13.910156 L 9.535156 12 L 5.070312 12 C 5.5625 8.058594 8.929688 5 13 5 C 16.351562 5 19.21875 7.070312 20.410156 10 L 22.539062 10 C 21.261719 5.949219 17.46875 3 13 3 Z M 14.070312 11.375 L 15.382812 14 L 20.933594 14 C 20.4375 17.941406 17.070312 21 13 21 C 8.929688 21 5.5625 17.941406 5.070312 14 L 8.464844 14 L 11.191406 18.089844 Z M 14.070312 11.375 " />
          </g>
        </svg>
      </button>
    </Tooltip>
  );
};

export default ReviewIconButton;
