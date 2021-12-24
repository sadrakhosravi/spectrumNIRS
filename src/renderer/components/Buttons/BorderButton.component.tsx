import React from 'react';

interface IProps {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const BorderButton: React.FC<IProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="inline-block px-4 py-2 text-sm border rounded-md border-white  hover:bg-accent hover:border-accent"
    >
      {text}
    </button>
  );
};
export default BorderButton;
