import React from 'react';

import ButtonTitleDescription from 'components/Global/ButtonTitleDescription/ButtonTitleDescription.component';

//Data file icon
import RecentFileIcon from 'assets/icons/recent-file.svg';
const RecentProject = () => {
  return (
    <div className="bg-grey2 grid grid-cols-5 px-3 py-5">
      <div className="col-span-3 flex items-center">
        <span className="inline-block mr-5">
          <img className="my-auto" src={RecentFileIcon} width="48px" alt="File" />
        </span>
        <span className="inline-block">
          <ButtonTitleDescription title="Project Name" description="Project Description" />
        </span>
      </div>
      <div className="col-span-2 flex items-center justify-end mr-1">
        <p className="text-light text-base">Saved: July 10, 2021</p>
      </div>
    </div>
  );
};

export default RecentProject;
