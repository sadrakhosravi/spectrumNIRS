import React, { useEffect } from 'react';

import RecentExperiment from './RecentExperiment.component';

import withLoading from '@hoc/withLoading.hoc';
import { useGetRecentExperimentsQuery } from '@redux/api/experimentsApi';

interface IRecentExperimentsContainer {
  recentExperiments?: Object[];
  children?: React.ReactNode;
  setLoading?: any;
}

const RecentExperimentsContainer = ({
  children,
  setLoading,
}: IRecentExperimentsContainer): JSX.Element => {
  const { data, isLoading, refetch } = useGetRecentExperimentsQuery(5);
  setLoading(isLoading);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="bg-grey1 h-full p-6 rounded-md overflow-y-auto">
      <input
        className="bg-light text-dark px-3 py-1 w-full placeholder-grey1 mb-5 rounded-sm"
        placeholder="Search recent experiments ..."
      />
      {data?.map((experiment: any) => (
        <RecentExperiment
          title={experiment.name}
          description={experiment.description}
        />
      ))}
      {children}
    </div>
  );
};

export default withLoading(RecentExperimentsContainer, 'Loading Experiments');
