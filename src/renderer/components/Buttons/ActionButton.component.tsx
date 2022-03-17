import React from 'react';

// Component
import IconText from '@components/MicroComponents/IconText/IconText.component';

type ActionButtonProps = {
  icon?: string;
  text?: string;
  darker?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onDoubleClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const ActionButton = (props: ActionButtonProps) => {
  const {
    icon,
    text,
    darker = false,
    isActive = false,
    disabled = false,
    onClick,
    onDoubleClick,
  } = props;

  const buttonBackground = darker
    ? `bg-dark hover:bg-grey2`
    : `bg-grey2 hover:bg-dark`;
  const activeStyle =
    isActive && 'bg-accent hover:bg-accent-hover active:bg-accent';
  const disabledStyle =
    disabled && 'bg-grey3 hover:bg-grey3 cursor-not-allowed';

  return (
    <button
      type="button"
      className={`${
        isActive ? activeStyle : buttonBackground
      } border-primary inline-block duration-150 focus:ring-2 focus:ring-accent ${disabledStyle} ${
        text ? 'px-4' : 'bg-grey1 px-3 active:bg-accent'
      } relative grid w-full auto-cols-max grid-flow-col items-center rounded-md py-1.5`}
      onClick={disabled ? undefined : onClick}
      onDoubleClick={disabled ? undefined : onDoubleClick}
    >
      <IconText text={text || undefined} icon={icon} />
    </button>
  );
};

export default ActionButton;
