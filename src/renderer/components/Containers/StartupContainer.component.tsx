import React from 'react';
import { useDispatch } from 'react-redux';
import { changeAppState } from '@redux/AppStateSlice';

// Icons
import NewFileIcon from '@icons/new-file.svg';
import OpenFileIcon from '@icons/open-file.svg';

// Components
import HeadingText from './StartupScreen/HeadingText/HeadingText.component';
import RecentProjectsContainer from './StartupScreen/RecentProjects/RecentProjectsContainer.component';
import IconButtons from './StartupScreen/IconButtons/IconButtons.component';

const StartupContainer = () => {
  const dispatch = useDispatch();

  return (
    <div className="h-full mx-auto pt-12 lg:w-5/6 xl:w-4/6">
      <HeadingText />
      <div className="grid grid-cols-5 mt-10 h-full gap-10">
        <div className="col-span-3 h-full">
          <RecentProjectsContainer />
        </div>
        <div className="col-span-2">
          <IconButtons
            icon={NewFileIcon}
            title="New Recording"
            description="Create a new NIRS recording"
            onClick={() => dispatch(changeAppState('record'))}
          />
          <IconButtons
            icon={OpenFileIcon}
            title="Open Recording"
            description="Open a recording file or project"
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default StartupContainer;
