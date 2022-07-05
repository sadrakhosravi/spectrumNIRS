import * as React from 'react';

// Styles
import styles from './grid.module.scss';

type GridType = {
  columnsTemplate: string;
  children: React.ReactNode;
  gap?: '0.5rem' | '1rem' | '2rem' | '3rem';
  rowGap?: '0.5rem' | '1rem' | '2rem' | '3rem';
};

export const Grid = ({ columnsTemplate, children, gap, rowGap }: GridType) => {
  return (
    <div
      className={styles.Grid}
      style={{
        gridTemplateColumns: columnsTemplate,
        columnGap: gap || '1rem',
        rowGap,
      }}
    >
      {children}
    </div>
  );
};
