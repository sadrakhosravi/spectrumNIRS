import withTooltip from '@hoc/withTooltip.hoc';
import React from 'react';

type BorderIconButtonProps = {
  icon: string;
  text?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const BorderIconButton = ({ text, icon, onClick }: BorderIconButtonProps) => {
  return (
    <button
      className="flex items-center py-1 px-4 rounded-md border-[1.5px] border-white hover:bg-accent hover:border-accent gap-2 ml-auto"
      onClick={onClick}
    >
      <img src={icon} />
      {text && <span>{text}</span>}
    </button>
  );
};
export default withTooltip(BorderIconButton);
