import * as React from 'react';

type ColumnType = {
  width: '25%' | '33.3%' | '50%' | '66.66%' | '75%' | '100%';
  children: React.ReactNode;
};

export const Column = ({ width, children }: ColumnType) => {
  return <div style={{ width }}>{children}</div>;
};
