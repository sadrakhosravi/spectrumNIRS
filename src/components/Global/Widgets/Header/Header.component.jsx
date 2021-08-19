import React from 'react';

//Widget header to display the title of each widget
const Header = props => {
  const { title } = props;

  return (
    <div className="w-full bg-grey1 h-10 grid items-center pl-3">
      <h5>{title}</h5>
    </div>
  );
};

export default Header;
