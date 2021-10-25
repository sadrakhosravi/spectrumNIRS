import React, { useEffect, useState } from 'react';

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
  const [experiments, setExperiments] = useState<any[]>([]);

  const { data, isLoading } = useGetRecentExperimentsQuery(5);

  // Handle side effects
  useEffect(() => {
    setLoading(isLoading);
    !isLoading && setExperiments(data);
  }, [isLoading]);

  const handleChange = (event: any) => {
    if (event.target.value !== '') {
      const searchedExperiments = experiments.filter((experiment: any) =>
        experiment.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setExperiments(searchedExperiments);
    }

    if (event.target.value === '') setExperiments(experiments);
  };

  return (
    <div className="bg-grey1 h-full p-6 rounded-md overflow-y-auto">
      <input
        className="bg-light text-dark px-3 py-1 w-full placeholder-grey1 mb-5 rounded-sm"
        placeholder="Search recent experiments ..."
        onChange={handleChange}
      />
      {experiments &&
        experiments.map((experiment: any) => (
          <RecentExperiment
            title={experiment.name}
            description={experiment.description}
            saved={experiment.updatedAt}
            key={experiment.id}
          />
        ))}
      {experiments.length === 0 && (
        <p className="text-white opacity-30">No recent experiment found.</p>
      )}
      {children}
    </div>
  );
};

export default withLoading(RecentExperimentsContainer, 'Loading Experiments');
