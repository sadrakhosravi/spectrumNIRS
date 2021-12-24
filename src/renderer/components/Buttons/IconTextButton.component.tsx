import React from 'react';

// Component
import IconText from '@components/MicroComponents/IconText/IconText.component';

interface IProps {
  icon?: string;
  text?: string;
  darker?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const IconTextButton: React.FC<IProps> = (props) => {
  const {
    icon,
    text,
    darker = false,
    isActive = false,
    disabled = false,
    onClick,
  } = props;

  const buttonBackground = darker
    ? `bg-dark hover:bg-grey2`
    : `bg-grey2 hover:bg-dark`;
  const activeStyle =
    isActive && 'bg-accent hover:bg-accent-hover active:bg-accent';
  const disabledStyle =
    disabled && 'bg-grey2 hover:bg-grey2 cursor-not-allowed';

  return (
    <button
      type="button"
      className={`${disabledStyle} ${disabled || buttonBackground} ${
        disabled || activeStyle
      } ${
        text ? 'px-4' : 'px-3 bg-grey1 active:bg-accent'
      } w-full py-2 grid grid-flow-col auto-cols-max items-center relative rounded-md`}
      onClick={onClick}
    >
      <IconText text={text || undefined} icon={icon} />
    </button>
  );
};

export default IconTextButton;
