import React from 'react';

// Icons
import WindowCloseIcon from '@icons/close2.svg';

type CloseButtonProps = {
  className?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const CloseButton = ({ className, onClick }: CloseButtonProps) => {
  return (
    <button
      className={`p-2 opacity-50 hover:opacity-100 ${className || ''}`}
      title="Close"
      onClick={onClick}
    >
      <img className="w-5 h-5" src={WindowCloseIcon} />
    </button>
  );
};
export default CloseButton;
