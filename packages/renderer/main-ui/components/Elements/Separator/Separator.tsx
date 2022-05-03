import * as React from 'react';

// Styles
import * as styles from './separator.module.scss';

type SeparatorType = {
  gap?: '0' | '0.25rem' | '0.5rem' | '1rem' | '2rem' | '3rem';
};

export const Separator = ({ gap }: SeparatorType) => {
  return (
    <div
      className={styles.Separator}
      style={{ marginTop: gap || '2rem', marginBottom: gap || '1rem' }}
    ></div>
  );
};
