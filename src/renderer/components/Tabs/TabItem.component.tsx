import React from 'react';

import IconText from '@components/MicroComponents/IconText/IconText.component';

type TabItems = {
  name: string;
  icon: string;
  isActive?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const TabItem = ({ name, icon, isActive, onClick }: TabItems) => {
  const tabColor = isActive
    ? `bg-grey1 z-10 border-accent hover:border-accent`
    : `border-dark2 hover:bg-grey2 hover:border-grey2 z-0`;

  return (
    <button
      type="button"
      className={`w-64 px-3 h-40px border-t-4 grid grid-flow-col auto-cols-max items-center transition duration-100 ${tabColor} `}
      onClick={onClick}
      id={name}
    >
      <IconText text={name} icon={icon} />
    </button>
  );
};

export default TabItem;
