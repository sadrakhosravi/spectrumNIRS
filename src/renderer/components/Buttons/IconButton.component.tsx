import React from 'react';

interface IProps {
  icon: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

// Renders only an icon as a clickable button
const IconButton = ({ icon, onClick }: IProps): JSX.Element => {
  return (
    <button
      type="button"
      className="p-2 h-full bg-grey1 hover:bg-grey2 active:bg-accent"
      onClick={onClick}
    >
      <img width="32rem" src={icon} alt="Icon" />
    </button>
  );
};
export default IconButton;
