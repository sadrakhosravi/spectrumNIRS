import React from 'react';

interface IProps {
  text: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const SubmitButton: React.FC<IProps> = ({
  text,
  onClick,
  disabled = false,
}) => {
  return (
    <div className="block text-center">
      <button
        onClick={onClick}
        disabled={disabled}
        type="submit"
        className={`inline-block justify-center mt-6 px-4 py-2 text-sm border-primary border-opacity-50 rounded-md text-white ${
          disabled
            ? 'text-opacity-40 cursor-not-allowed'
            : 'hover:bg-grey0 active:ring-2 active:ring-accent'
        }`}
      >
        {text}
      </button>
    </div>
  );
};
export default SubmitButton;
