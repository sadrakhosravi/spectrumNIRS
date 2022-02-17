import React from 'react';

type DisabledOverlayProps = {
  title?: string;
  message?: string;
};

const DisabledOverlay = ({ title, message }: DisabledOverlayProps) => {
  return (
    <div
      className="absolute top-0 left-0 z-50 flex h-full w-full cursor-not-allowed items-center justify-center rounded-md bg-dark2/90 transition-all duration-150"
      title={title || 'This section is disabled'}
    >
      {message && (
        <p className="px-4 text-center transition-all duration-300">
          {message}
        </p>
      )}
    </div>
  );
};
export default DisabledOverlay;
