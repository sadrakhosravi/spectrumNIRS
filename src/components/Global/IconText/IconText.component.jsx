import React from 'react';

const IconText = props => {
  const { icon, text, large } = props;

  const textSize = large ? `text-xl` : ``;
  const iconSize = large ? `32rem` : `26rem`;

  return (
    <>
      <span className="mr-2">
        <img width={iconSize} src={icon} alt="Icon" />
      </span>
      <span className={textSize}>{text}</span>
    </>
  );
};

export default IconText;
