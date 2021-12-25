import React from 'react';

// Icons
import CloseIcon2 from '@icons/close2.svg';

type ChildTitlebarProps = {
  text: string;
  icon?: string;
};

const ChildTitlebar = ({ icon, text = '' }: ChildTitlebarProps) => {
  const closeWindow = () => {
    window.api.sendIPC('window:close');
  };
  return (
    <div className="flex items-center cursor-move px-2 h-[30px] border-b-[1px] border-opacity-50 w-full relative bg-grey1 z-50 window-drag ">
      <div className="w-full window-drag cursor-move flex items-center gap-1">
        {icon && <img src={icon} width="28px" />}
        <p className="text-white">{text}</p>
      </div>
      <div className="no-drag ">
        <img
          className="w-[32px] cursor-pointer opacity-50 hover:opacity-100 z-50"
          src={CloseIcon2}
          alt="Close"
          title="Close Settings"
          onClick={closeWindow}
        />
      </div>
    </div>
  );
};
export default ChildTitlebar;
