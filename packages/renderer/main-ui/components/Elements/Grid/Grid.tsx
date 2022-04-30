import * as React from 'react';

// Styles
import * as styles from './grid.module.scss';

type GridType = {
  columnsTemplate: string;
  children: React.ReactNode;
  gap?: '0.5rem' | '1rem' | '2rem' | '3rem';
};

export const Grid = ({ columnsTemplate, children, gap }: GridType) => {
  return (
    <div
      className={styles.Grid}
      style={{
        gridTemplateColumns: columnsTemplate,
        columnGap: gap || '1rem',
      }}
    >
      {children}
    </div>
  );
};
