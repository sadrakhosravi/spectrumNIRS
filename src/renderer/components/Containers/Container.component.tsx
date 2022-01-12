import React from 'react';

type ContainerProps = {
  children: React.ReactNode;
  noPadding?: boolean;
};

const Container = ({ noPadding = false, children }: ContainerProps) => {
  return (
    <div
      className={`bg-grey1 h-full w-full rounded-md overflow-y-auto overflow-x-hidden border-primary ${
        noPadding ? '' : 'p-6'
      }`}
    >
      {children}
    </div>
  );
};
export default Container;
