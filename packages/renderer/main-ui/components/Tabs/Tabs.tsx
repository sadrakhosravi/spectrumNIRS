import * as React from 'react';

type TabsType = {
  children: JSX.Element | JSX.Element[];
};

export const Tabs = ({ children }: TabsType) => {
  return <div>{children}</div>;
};
