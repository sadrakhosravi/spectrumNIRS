import React from 'react';

type ButtonProps = {
  text?: string;
  icon?: string;
  className?: string;
  style?: React.CSSProperties | undefined;
  isActive?: boolean;
  disabled?: boolean;
  title?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const Button = ({
  text,
  icon,
  className,
  style,
  isActive,
  disabled,
  title,
  type,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={` text-sm text-white inline-flex gap-1 items-center border-primary px-2 py-[0.4rem] rounded-md transition-colors duration-150 focus:ring-2 focus:ring-accent ${
        isActive ? 'bg-accent hover:bg-accent/80' : 'bg-grey1 hover:bg-grey0'
      } ${className || ''}  ${disabled ? 'cursor-not-allowed !bg-grey3' : ''}
      `}
      style={style}
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {icon && <img src={icon} className="w-5" />}
      {text && text}
    </button>
  );
};
export default Button;
