import React from 'react';

// Components
import ButtonTitleDescription from '@components/MicroComponents/ButtonTitleDescription/ButtonTitleDescription.component';

interface IProps {
  icon: string;
  title: string;
  description: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const LargeIconTextButton = ({
  icon,
  title,
  description,
  onClick,
}: IProps): JSX.Element => {
  return (
    <button
      type="button"
      className="bg-grey1 p-5 mb-5 w-full grid grid-flow-col auto-cols-max gap-6 items-center hover:bg-accent rounded-md border-primary"
      onClick={onClick}
    >
      <div>
        <img width="58px" src={icon} alt="Icon" />
      </div>
      <div className="text-left">
        <ButtonTitleDescription title={title} description={description} />
      </div>
    </button>
  );
};

export default LargeIconTextButton;
