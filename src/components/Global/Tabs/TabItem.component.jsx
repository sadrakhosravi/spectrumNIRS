import React from 'react';

import IconText from 'components/Other/IconText/IconText.component';

const TabItem = props => {
  const { text, icon, isActive, onClick } = props;

  const tabColor = isActive ? `bg-accent` : `bg-grey2 hover:bg-light2 active:bg-accent`;

  return (
    <button
      className={`${tabColor} w-64 tab-item-height px-3 grid grid-flow-col auto-cols-max items-center transition duration-100`}
      onClick={onClick}
    >
      <IconText text={text} icon={icon} large={true} />
    </button>
  );
};

export default TabItem;
