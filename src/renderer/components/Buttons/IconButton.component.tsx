import React from 'react';

interface IProps {
  icon: string | undefined;
  isActive?: boolean | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

// Renders only an icon as a clickable button
const IconButton = ({ icon, onClick, isActive }: IProps): JSX.Element => {
  return (
    <button
      type="button"
      className={`px-2 py-1.5 ring-accent active:ring-2 rounded-md bg-grey2 border-primary transition-colors duration-150 ${
        isActive ? 'bg-accent' : 'hover:bg-grey0'
      }`}
      onClick={onClick}
    >
      <img src={icon} className="w-6" alt="Icon" />
    </button>
  );
};
export default IconButton;
