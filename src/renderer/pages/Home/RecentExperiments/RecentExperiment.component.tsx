import React from 'react';

// Icons
import RecentFileIcon from '@icons/recent-file.svg';

// Components
import ButtonTitleDescription from '@components/MicroComponents/ButtonTitleDescription/ButtonTitleDescription.component';

interface IProps {
  title: string;
  description: string;
  saved: string;
  isActive?: boolean;
  key?: any;
}

const RecentExperiment: React.FC<IProps> = ({
  title,
  description,
  saved,
  isActive = false,
}) => {
  return (
    <div
      className={`${
        isActive ? 'bg-accent' : 'bg-grey2'
      } grid grid-cols-5 px-3 py-5 mb-3 rounded-md`}
    >
      <div className="col-span-3 flex items-center">
        <span className="inline-block mr-5">
          <img
            className="my-auto"
            src={RecentFileIcon}
            width="48px"
            alt="File"
          />
        </span>
        <span className="inline-block">
          <ButtonTitleDescription title={title} description={description} />
        </span>
      </div>
      <div className="col-span-2 flex items-center justify-end mr-1">
        <p className="text-light text-base">
          Saved: {saved.toString().split(' ')[0]}
        </p>
      </div>
    </div>
  );
};

export default RecentExperiment;
