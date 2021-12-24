import React from 'react';

type ButtonProps = {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const PrimaryButton = ({ text, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="inline-block px-4 py-2 text-sm border border-transparent rounded-md bg-accent border-accent hover:bg-opacity-80 active:bg-opacity-100 "
    >
      {text}
    </button>
  );
};
export default PrimaryButton;
