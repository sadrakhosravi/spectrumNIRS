import React from 'react';

// Components
import RecentExperimentsContainerComponent from '@pages/Home/RecentExperiments/RecentExperimentsContainer.component';

const OpenExperimentForm = () => {
  return (
    <div>
      <RecentExperimentsContainerComponent numOfExps={-1} />
    </div>
  );
};
export default OpenExperimentForm;
