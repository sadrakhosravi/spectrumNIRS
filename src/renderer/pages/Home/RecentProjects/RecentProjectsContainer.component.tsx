import useGetRecentExperiments from '@hooks/useGetRecentExperiments.hook';
import React from 'react';

// Components
import RecentProject from './RecentProject/RecentProject.component';

const RecentProjectsContainer = () => {
  const recentExperiments = useGetRecentExperiments(4);

  const recentExpOutput = recentExperiments.map((experiment: any) => (
    <RecentProject
      title={experiment.name}
      description={experiment.description}
    />
  ));

  return (
    <div className="bg-grey1 max-h-4/6 h-4/6 p-6 rounded-md">
      <input
        className="bg-light text-dark px-3 py-1 w-full placeholder-grey1 mb-5 rounded-sm"
        placeholder="Search for a recent project ..."
      />
      {recentExpOutput}
    </div>
  );
};

export default RecentProjectsContainer;
