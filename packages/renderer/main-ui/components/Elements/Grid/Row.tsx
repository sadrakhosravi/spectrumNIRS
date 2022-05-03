import * as React from 'react';

// Styles
import * as styles from './grid.module.scss';

type RowType = {
  children: React.ReactNode;
  marginTop?: '0.5rem' | '0.75rem' | '1rem' | '2rem';
  marginBottom?: '0.5rem' | '0.75rem' | '1rem' | '2rem';
  gap?: '0.5rem' | '0.75rem' | '1rem' | '2rem';
  flexWrap?: boolean;
};

export const Row = ({ children, gap, marginTop, marginBottom, flexWrap }: RowType) => {
  return (
    <div
      className={styles.Row}
      style={{
        gap: gap || '0.5rem',
        marginTop,
        marginBottom,
        flexWrap: flexWrap ? 'wrap' : undefined,
      }}
    >
      {children}
    </div>
  );
};
