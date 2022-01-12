import React from 'react';

type ButtonProps = {
  text?: string;
  icon?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const Button = ({ text, icon, className, onClick }: ButtonProps) => {
  return (
    <button
      className={` text-sm text-white inline-flex gap-1 items-center border-primary bg-grey1 hover:bg-grey0 px-2 py-[0.35rem] rounded-md transition-colors duration-150 focus:ring-2 focus:ring-accent
      ${className || ''}
      `}
      onClick={onClick}
    >
      {icon && <img src={icon} className="w-5" />}
      {text && text}
    </button>
  );
};
export default Button;
