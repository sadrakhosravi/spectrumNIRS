import React from 'react';

type DeleteButtonProps = {
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
  title: string;
  className?: string;
};

const DeleteButton = ({ onClick, title, className }: DeleteButtonProps) => {
  return (
    <div
      className={`p-3 hover:bg-white hover:bg-opacity-30 active:bg-opacity-70 rounded-md z-30 ${
        className || ''
      }`}
      title={title}
      onClick={onClick}
    >
      ❌
    </div>
  );
};
export default DeleteButton;
