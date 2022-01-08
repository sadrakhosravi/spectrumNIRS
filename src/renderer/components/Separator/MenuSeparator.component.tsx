import React from 'react';

type MenuSeparatorProps = {
  className?: string;
};

const MenuSeparator = ({ className }: MenuSeparatorProps) => {
  return (
    <div
      className={`mx-auto bg-white bg-opacity-20 h-[1px] ${
        className || 'my-1 w-[90%]'
      }`}
    />
  );
};
export default MenuSeparator;
