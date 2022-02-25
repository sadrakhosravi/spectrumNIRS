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
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        type="submit"
        className={`border-primary mt-4 inline-block justify-center rounded-md border-opacity-50 px-4 py-2 text-sm text-white ${
          disabled
            ? 'cursor-not-allowed text-opacity-40'
            : 'hover:bg-grey0 active:ring-2 active:ring-accent'
        }`}
      >
        {text}
      </button>
    </div>
  );
};
export default SubmitButton;
