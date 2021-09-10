import React from 'react';

// Component
import IconText from '@other/IconText/IconText.component';
import Tooltip from '@globalComponent/Tooltip/Tooltip.component';

const IconButton = (props: any) => {
  const {
    icon,
    text,
    darker,
    isActive,
    disabled = false,
    tooltip = false,
    tooltipText,
    tooltipPlacement = 'bottom',
    onClick,
  } = props;

  const buttonBackground = darker
    ? `bg-dark hover:bg-grey2`
    : `bg-grey2 hover:bg-dark`;
  const activeStyle = isActive && 'bg-accent hover:bg-accent-hover';
  const disabledStyle =
    disabled && 'bg-grey2 hover:bg-grey2 cursor-not-allowed';

  return (
    <Tooltip tooltip={tooltip} placement={tooltipPlacement} text={tooltipText}>
      <button
        type="button"
        className={`${disabledStyle} ${disabled || buttonBackground} ${
          disabled || activeStyle
        } px-4 w-full py-2 grid grid-flow-col auto-cols-max items-center transition relative duration-100 active:bg-accent `}
        onClick={onClick}
      >
        <IconText text={text} icon={icon} />
      </button>
    </Tooltip>
  );
};

export default IconButton;
