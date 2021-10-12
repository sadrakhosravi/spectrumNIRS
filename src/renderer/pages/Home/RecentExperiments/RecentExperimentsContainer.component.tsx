import React, { useState, useEffect } from 'react';

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
  const [experiments, setExperiments] = useState([]);

  const { data, isLoading } = useGetRecentExperimentsQuery(5, {
    refetchOnMountOrArgChange: true,
  });
  setLoading(isLoading);

  console.log(data);

  useEffect(() => {
    !isLoading && setExperiments(data);
  }, [isLoading]);

  const handleChange = (event: any) => {
    if (event.target.value !== '') {
      const searchedExperiments = data.filter((experiment: any) =>
        experiment.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setExperiments(searchedExperiments);
    }
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
            key={experiment.experiment_id}
          />
        ))}
      {children}
    </div>
  );
};

export default withLoading(RecentExperimentsContainer, 'Loading Experiments');
