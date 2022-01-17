import React from 'react';
import ButtonTitleDescription from '@components/MicroComponents/ButtonTitleDescription/ButtonTitleDescription.component';
import DeleteButton from '@components/Buttons/DeleteButton.component';

type ListButtonProps = {
  isActive: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
  icon: string;
  text: string;
  description: string | JSX.Element | JSX.Element;
  deleteOnClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  time?: string;
  deleteTitle?: string;
  className?: string;
};

const ListButton = ({
  isActive,
  onClick,
  icon,
  text,
  description,
  deleteOnClick,
  deleteTitle,
  time,
  className,
}: ListButtonProps) => {
  return (
    <div>
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
          <div
            className={`flex w-1/3 items-center justify-end ${
              deleteOnClick !== undefined && 'mr-14'
            }`}
          >
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
      </button>

      <DeleteButton
        className="absolute right-4 top-1/2 -translate-y-1/2"
        onClick={deleteOnClick}
        title={deleteTitle || 'Delete'}
      />
    </div>
  );
};
export default ListButton;
