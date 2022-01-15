import React from 'react';

type DisabledOverlayProps = {
  title?: string;
};

const DisabledOverlay = ({ title }: DisabledOverlayProps) => {
  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-dark2/80 cursor-not-allowed z-50 rounded-md"
      title={title || 'This section is disabled'}
    />
  );
};
export default DisabledOverlay;
