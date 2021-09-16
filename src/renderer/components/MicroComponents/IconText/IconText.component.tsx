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
    <div className="grid items-center grid-flow-col auto-cols-max">
      <span className="mr-2 inline-block">
        <img
          className="transition duration-200"
          width={iconSize}
          src={icon}
          alt="Icon"
        />
      </span>
      <span className={`${textSize} inline-block`}>{text}</span>
    </div>
  );
};

export default IconText;
