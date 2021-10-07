import React from 'react';

// Adapters
import { openNewExperimentForm } from '@adapters/dispatchAdapter';

// Hooks
import useLoadingState from '@hooks/useLoadingState.hook';

// Icons
import NewFileIcon from '@icons/new-file.svg';
import OpenFileIcon from '@icons/open-file.svg';

// Components
import HeadingText from './HeadingText/HeadingText.component';
import RecentProjectsContainer from './RecentProjects/RecentProjectsContainer.component';
import LargeIconTextButton from '@components/Buttons/LargeIconTextButton.component';

const HomePage = () => {
  // Set the loading state to false on component load
  useLoadingState(false);

  return (
    <div className="h-full mx-auto pt-12 lg:w-5/6 xl:w-4/6">
      <HeadingText />
      <div className="grid grid-cols-5 mt-10 h-full gap-10">
        <div className="col-span-3 h-full">
          <RecentProjectsContainer />
        </div>
        <div className="col-span-2">
          <LargeIconTextButton
            icon={NewFileIcon}
            title="New Recording"
            description="Create a new NIRS recording"
            onClick={() => {
              openNewExperimentForm();
            }}
          />
          <LargeIconTextButton
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
