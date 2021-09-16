import React from 'react';
import { useDispatch } from 'react-redux';

import { setIsNewExperiment } from '@redux/NewExperimentSlice';

// Icons
import NewFileIcon from '@icons/new-file.svg';
import OpenFileIcon from '@icons/open-file.svg';

// Components
import HeadingText from './HeadingText/HeadingText.component';
import RecentProjectsContainer from './RecentProjects/RecentProjectsContainer.component';
import IconButtons from './IconButtons/IconButtons.component';
import NewExperiment from './NewExperiment/NewExperiment.component';

const HomePage = () => {
  const dispatch = useDispatch();

  return (
    <div className="h-full mx-auto pt-12 lg:w-5/6 xl:w-4/6">
      <NewExperiment />
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
            onClick={() => {
              dispatch(setIsNewExperiment(true));
            }}
          />
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

export default HomePage;
