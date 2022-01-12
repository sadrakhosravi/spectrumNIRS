import React from 'react';

type ToolbarContainerProps = {
  children: React.ReactNode;
};

const ToolbarContainer = ({ children }: ToolbarContainerProps) => {
  return (
    <div className="w-full bg-[#252526] px-2 max-h-[50px] h-[50px] relative drop-shadow-xl border-b-1 border-grey5 z-40">
      {children}
    </div>
  );
};
export default ToolbarContainer;
