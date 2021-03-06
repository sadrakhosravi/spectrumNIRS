import React from 'react';

interface Props {
  icon: string;
  alt?: string;
  text: string;
  width?: string;
}

const TrayIconButtons: React.FunctionComponent<Props> = ({
  icon,
  alt = 'Icon',
  text,
  width = '34px',
}: Props) => {
  return (
    <button
      type="button"
      className="px-3 h-30px hover:bg-white hover:bg-opacity-20 transition duration-200"
    >
      <div className="grid grid-flow-col auto-cols-max items-center">
        <img
          src={icon}
          width={width}
          className="icon inline-block pr-2"
          alt={alt}
        />

        {text}
      </div>
    </button>
  );
};
export default TrayIconButtons;
