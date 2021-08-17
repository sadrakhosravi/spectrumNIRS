import React from 'react';

import IconText from '@globalComponent/IconText/IconText.component';

const TabItem = ({ text, icon, isActive }) => {
  const tabColor = isActive ? `bg-accent` : `bg-grey2`;

  return (
    <button className={`${tabColor} w-64 h-12 px-3 grid grid-flow-col auto-cols-max items-center`}>
      <IconText text={text} icon={icon} />
    </button>
  );
};

export default TabItem;
