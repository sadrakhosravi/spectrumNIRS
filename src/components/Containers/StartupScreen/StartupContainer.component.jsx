import React from 'react';

import HeadingText from './HeadingText/HeadingText.component';
import RecentProjectsContainer from './RecentProjects/RecentProjectsContainer.component';
import IconButtons from './IconButtons/IconButtons.component';

//Icons
import NewFileIcon from 'assets/icons/new-file.svg';
import OpenFileIcon from 'assets/icons/open-file.svg';

const StartupContainer = () => {
  return (
    <div className="h-full w-3/4 mx-auto pt-12">
      <HeadingText />
      <div className="grid grid-cols-5 mt-10 h-full gap-10">
        <div className="col-span-3">
          <RecentProjectsContainer />
        </div>
        <div className="col-span-2">
          <IconButtons icon={NewFileIcon} title="New Recording" description="Create a new NIRS recording" />
          <IconButtons
            icon={OpenFileIcon}
            title="Open Recording"
            description="Open a recording file or project"
          />
        </div>
      </div>
    </div>
  );
};

export default StartupContainer;
