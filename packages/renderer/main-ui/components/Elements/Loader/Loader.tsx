import * as React from 'react';

// Styles
import * as styles from './loader.module.scss';

export const Loader = () => {
  return (
    <div className={styles.LoaderContainer}>
      <div className={styles.Loader}></div>
      <span className="text-larger">Loading ...</span>
    </div>
  );
};
