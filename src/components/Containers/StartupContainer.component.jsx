import React from 'react';

import HeadingText from './StartupScreen/HeadingText/HeadingText.component';
import RecentProjectsContainer from './StartupScreen/RecentProjects/RecentProjectsContainer.component';
import IconButtons from './StartupScreen/IconButtons/IconButtons.component';

//Icons
import NewFileIcon from '@icons/new-file.svg';
import OpenFileIcon from '@icons/open-file.svg';

const StartupContainer = () => {
  return (
    <div className="h-full mx-auto pt-12 lg:w-5/6 xl:w-4/6">
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
