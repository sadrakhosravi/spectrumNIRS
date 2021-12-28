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
      className={`px-2 py-1 h-full active:bg-accent rounded-md ${
        isActive ? 'bg-accent' : 'hover:bg-grey2'
      }`}
      onClick={onClick}
    >
      <img src={icon} width="30px" alt="Icon" />
    </button>
  );
};
export default IconButton;
