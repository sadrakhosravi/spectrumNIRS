import React from 'react';

//Component
import IconText from '@globalComponent/IconText/IconText.component';

const IconButton = props => {
  const { icon, text, darker } = props;

  const buttonBackground = darker ? `bg-dark hover:bg-grey2` : `bg-grey2 hover:bg-dark`;

  return (
    <button
      className={`${buttonBackground} px-4 py-2 grid grid-flow-col auto-cols-max items-center transition duration-100 active:bg-accent `}
    >
      <IconText text={text} icon={icon} />
    </button>
  );
};

export default IconButton;
