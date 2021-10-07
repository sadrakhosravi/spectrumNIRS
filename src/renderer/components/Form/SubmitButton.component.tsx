import React from 'react';

interface IProps {
  text: string;
}

const SubmitButton: React.FC<IProps> = ({ text }) => {
  return (
    <div className="block text-center">
      <button
        type="submit"
        className="inline-block justify-center mt-6 px-4 py-2 text-sm border border-transparent rounded-md border-white  hover:bg-accent hover:border-accent transition"
      >
        {text}
      </button>
    </div>
  );
};
export default SubmitButton;
