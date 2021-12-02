import React from 'react';

interface IProps {
  icon?: string;
  text?: string;
  large?: boolean;
}

const IconText: React.FC<IProps> = (props) => {
  const { icon, text, large } = props;

  const textSize = large ? `text-xl` : ``;
  const iconSize = large ? `32rem` : `26rem`;

  return (
    <div className="grid items-center grid-flow-col auto-cols-max">
      <span className={`${text && icon && 'mr-2'} inline-block"`}>
        {icon && (
          <img
            className="transition duration-200"
            width={text ? iconSize : '32rem'}
            src={icon}
            alt="Icon"
          />
        )}
      </span>
      {text && <span className={`${textSize} inline-block`}>{text}</span>}
    </div>
  );
};

export default IconText;
