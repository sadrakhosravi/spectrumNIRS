import React from 'react';

type TabButtonProps = {
  text: string;
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
  isActive?: boolean;
};

const TabButton = ({ text, onClick, isActive = false }: TabButtonProps) => {
  return (
    <div
      className={`flex items-center h-10 w-1/2 px-4 border-t-4 cursor-pointer ${
        isActive
          ? 'bg-grey3 border-accent'
          : 'border-grey1 hover:bg-grey2 hover:border-grey2 '
      }`}
      onClick={onClick}
    >
      {text}
    </div>
  );
};
export default TabButton;
