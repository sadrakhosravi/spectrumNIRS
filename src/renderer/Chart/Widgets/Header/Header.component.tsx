import React from 'react';

type WidgetHeaderProps = {
  children?: JSX.Element | JSX.Element[];
};

//Widget header to display the title of each widget
const Header = ({ children }: WidgetHeaderProps) => {
  return (
    <div className="flex w-full bg-grey1 h-10 items-center">{children}</div>
  );
};

export default Header;
