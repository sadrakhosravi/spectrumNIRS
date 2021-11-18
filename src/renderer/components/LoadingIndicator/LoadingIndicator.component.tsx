import React from 'react';

const LoadingIndicator = ({ loadingMessage }: { loadingMessage?: string }) => {
  return (
    <>
      <div className="absolute h-full w-full inset-0 flex flex-col items-center justify-center transition-all duration-300 bg-dark bg-opacity-80 z-50">
        <div className="lds-ring block">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="block">{loadingMessage || null}</div>
      </div>
    </>
  );
};
export default LoadingIndicator;
