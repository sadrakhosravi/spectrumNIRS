import React from 'react';
import ButtonTitleDescription from '@components/MicroComponents/ButtonTitleDescription/ButtonTitleDescription.component';
import DeleteButton from '@components/Buttons/DeleteButton.component';

type IconTextButtonWithTimeStampProps = {
  isActive: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
  icon: string;
  text: string;
  description: string;
  deleteOnClick: React.MouseEventHandler<HTMLDivElement> | undefined;
  time?: string;
  deleteTitle?: string;
  className?: string;
};

const IconTextButtonWithTimeStamp = ({
  isActive,
  onClick,
  icon,
  text,
  description,
  deleteOnClick,
  deleteTitle,
  time,
  className,
}: IconTextButtonWithTimeStampProps) => {
  return (
    <button
      type="button"
      className={`${
        isActive ? 'bg-accent' : 'bg-grey2 hover:bg-grey3 '
      } flex gap-2 items-center w-full mb-3 rounded-md hover:cursor-pointer border-primary active:ring-2 active:ring-accent focus:ring-2 focus:ring-accent ${
        className || ''
      }`}
    >
      <div className="w-full flex px-3 py-2" onClick={onClick}>
        <div className="flex w-2/3 items-center">
          <span className="inline-block mr-5">
            <img className="opacity-80" src={icon} width="42px" alt="File" />
          </span>
          <span className="inline-block text-left">
            <ButtonTitleDescription title={text} description={description} />
          </span>
        </div>
        <div className="flex w-1/3 items-center justify-end mr-1">
          <span className="text-right">
            {time && (
              <p className="text-light text-sm">
                Last Saved: {time.toString().split(', ')[0]}
              </p>
            )}
            {time && (
              <p className="text-light text-sm">
                Time: {time.toString().split(', ')[1]}
              </p>
            )}
          </span>
        </div>
      </div>
      <DeleteButton
        className="mr-4"
        onClick={deleteOnClick}
        title={deleteTitle || 'Delete'}
      />
    </button>
  );
};
export default IconTextButtonWithTimeStamp;
