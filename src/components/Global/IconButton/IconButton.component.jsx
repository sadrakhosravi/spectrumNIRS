import React from 'react';

//Component
import IconText from '@globalComponent/IconText/IconText.component';

const IconButton = props => {
  const { icon, text, darker } = props;

  const buttonBackground = darker ? `bg-dark` : `bg-grey2`;

  return (
    <button
      className={`${buttonBackground} px-4 py-2 grid grid-flow-col auto-cols-max items-center transition duration-100 hover:bg-dark active:bg-accent `}
    >
      <IconText text={text} icon={icon} />
    </button>
  );
};

export default IconButton;
