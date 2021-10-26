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
    ? `bg-accent`
    : `bg-grey2 hover:bg-light2 active:bg-accent`;

  return (
    <button
      type="button"
      className={`${tabColor} w-64 px-3 h-40px grid grid-flow-col auto-cols-max items-center transition duration-100`}
      onClick={onClick}
      id={name}
    >
      <IconText text={name} icon={icon} />
    </button>
  );
};

export default TabItem;
