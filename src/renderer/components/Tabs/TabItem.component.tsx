import React from 'react';

import IconText from '@components/MicroComponents/IconText/IconText.component';

const TabItem = (props: any) => {
  const { text, icon, isActive, onClick } = props;

  const tabColor = isActive
    ? `bg-accent`
    : `bg-grey2 hover:bg-light2 active:bg-accent`;

  return (
    <button
      type="button"
      className={`${tabColor} w-64 px-3 h-40px grid grid-flow-col auto-cols-max items-center transition duration-100`}
      onClick={onClick}
      id={text}
    >
      <IconText text={text} icon={icon} />
    </button>
  );
};

export default TabItem;
