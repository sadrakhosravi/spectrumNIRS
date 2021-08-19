import React from 'react';

import styles from './IconButtons.module.css';

const SignalIconButton = props => {
  return (
    <button className={styles.IconButton}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="3.1rem" height="3.1rem">
        <g>
          <path d="M 5 5 L 5 27 L 27 27 L 27 5 Z M 7 7 L 25 7 L 25 25 L 7 25 Z M 15.09375 9 L 14.9375 9.78125 L 12.8125 18.90625 L 11.9375 16.65625 L 11.6875 16 L 8 16 L 8 18 L 10.3125 18 L 11.96875 22.34375 L 12.21875 23 L 13.90625 23 L 14.0625 22.21875 L 16.0625 13.6875 L 17.03125 17.25 L 17.65625 19.5 L 18.84375 17.53125 C 18.84375 17.53125 19.09375 17 20 17 C 20.90625 17 21.1875 17.53125 21.1875 17.53125 L 21.46875 18 L 24 18 L 24 16 L 22.40625 16 C 21.988281 15.566406 21.285156 15 20 15 C 19.394531 15 19.042969 15.289062 18.625 15.5 L 17.0625 9.75 L 16.875 9 Z M 15.09375 9 " />
        </g>
      </svg>
    </button>
  );
};

export default SignalIconButton;
