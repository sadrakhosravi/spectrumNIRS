import React from 'react';

import RecentProject from './RecentProject/RecentProject.component';

const RecentProjectsContainer = () => {
  return (
    <div className="bg-grey1 h-4/6 p-6">
      <input
        className="bg-light text-dark px-3 py-1 w-full placeholder-grey1 mb-5"
        placeholder="Search for a recent project ..."
      ></input>
      <RecentProject />
    </div>
  );
};

export default RecentProjectsContainer;
