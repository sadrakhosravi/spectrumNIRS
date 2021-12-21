import React from 'react';
import LoadingIndicator from './LoadingIndicator.component';

const FirstLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-[100] bg-dark flex items-center justify-center">
      <LoadingIndicator loadingMessage="Preparing your experience..." />
    </div>
  );
};
export default FirstLoader;
