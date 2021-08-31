import React from 'react';

//Component
import IconText from '@other/IconText/IconText.component';

const IconButton = props => {
  const { icon, text, darker, isActive, disabled = false, onClick } = props;

  const buttonBackground = darker ? `bg-dark hover:bg-grey2` : `bg-grey2 hover:bg-dark`;
  const activeStyle = isActive && 'bg-accent hover:bg-accent-hover';
  const disabledStyle = disabled && 'bg-grey2 hover:bg-grey2 cursor-not-allowed';

  return (
    <button
      className={`${disabledStyle} ${disabled || buttonBackground} ${
        disabled || activeStyle
      } px-4 w-full py-2 grid grid-flow-col auto-cols-max items-center transition duration-100 active:bg-accent `}
      onClick={onClick}
      disabled={disabled}
    >
      <IconText text={text} icon={icon} />
    </button>
  );
};

export default IconButton;
