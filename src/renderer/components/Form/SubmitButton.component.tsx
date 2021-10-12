import React from 'react';

interface IProps {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const SubmitButton: React.FC<IProps> = ({ text, onClick }) => {
  return (
    <div className="block text-center">
      <button
        onClick={onClick}
        type="submit"
        className="inline-block justify-center mt-6 px-4 py-2 text-sm border border-transparent rounded-md border-white  hover:bg-accent hover:border-accent transition"
      >
        {text}
      </button>
    </div>
  );
};
export default SubmitButton;
