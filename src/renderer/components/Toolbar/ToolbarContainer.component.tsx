import React from 'react';

type ToolbarContainerProps = {
  children: React.ReactNode;
};

const ToolbarContainer = ({ children }: ToolbarContainerProps) => {
  return (
    <div className="relative z-40 flex h-[50px] max-h-[50px] w-full items-center border-b-1 border-grey5 bg-[#252526] px-2 drop-shadow-xl">
      {children}
    </div>
  );
};
export default ToolbarContainer;
