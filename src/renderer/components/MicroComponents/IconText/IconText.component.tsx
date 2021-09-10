import React from 'react';

interface IProps {
  icon: string;
  text: string;
  large?: boolean;
}

const IconText: React.FC<IProps> = (props) => {
  const { icon, text, large } = props;

  const textSize = large ? `text-xl` : ``;
  const iconSize = large ? `32rem` : `26rem`;

  return (
    <>
      <span className="mr-2">
        <img
          className="transition duration-200"
          width={iconSize}
          src={icon}
          alt="Icon"
        />
      </span>
      <span className={textSize}>{text}</span>
    </>
  );
};

export default IconText;
