import React from 'react';

// Adapters
import { openNewExperimentForm } from '@adapters/dispatchAdapter';

// Hooks

// Icons
import NewFileIcon from '@icons/new-file.svg';
import OpenFileIcon from '@icons/open-file.svg';

// Components
import HeadingText from './HeadingText/HeadingText.component';
import RecentExperiments from './RecentExperiments/RecentExperimentsContainer.component';
import LargeIconTextButton from '@components/Buttons/LargeIconTextButton.component';

const HomePage = () => {
  return (
    <div className="h-full mx-auto pt-12 lg:w-5/6 xl:w-4/6">
      <HeadingText />
      <div className="grid grid-cols-5 mt-10 h-full gap-10">
        <div className="col-span-3 h-3/4">
          <RecentExperiments />
        </div>
        <div className="col-span-2">
          <LargeIconTextButton
            icon={NewFileIcon}
            title="New Experiment"
            description="Create a new experiment"
            onClick={() => {
              openNewExperimentForm();
            }}
          />
          <LargeIconTextButton
            icon={OpenFileIcon}
            title="Open Experiment"
            description="Open an experiment file or project"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
