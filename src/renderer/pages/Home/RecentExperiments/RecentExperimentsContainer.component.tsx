import React, { useEffect, useState } from 'react';

import RecentExperiment from './RecentExperiment.component';

import withLoading from '@hoc/withLoading.hoc';
import { useGetRecentExperimentsQuery } from '@redux/api/experimentsApi';
import { useAppSelector } from '@redux/hooks/hooks';

type ExperimentsContainer = {
  recentExperiments?: Object[];
  children?: React.ReactNode;
  setLoading?: any;
};

type ExperimentState = {
  data: any[];
  searchedExperiments: any[];
};

const RecentExperimentsContainer = ({
  children,
  setLoading,
}: ExperimentsContainer): JSX.Element => {
  const [experiments, setExperiments] = useState<ExperimentState>({
    data: [],
    searchedExperiments: [],
  });
  const currentExperimentId = useAppSelector(
    (state) => state.experimentData.currentExperiment.id
  );

  const { data, isLoading, refetch } = useGetRecentExperimentsQuery(5);

  // Handle side effects
  useEffect(() => {
    refetch();
    setLoading(isLoading);
    !isLoading && setExperiments({ data, searchedExperiments: data });
  }, [isLoading]);

  const handleChange = (event: any) => {
    if (event.target.value !== '') {
      const searchedExperiments = experiments.data.filter((experiment: any) =>
        experiment.name.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setExperiments((prevState) => {
        return { ...prevState, searchedExperiments };
      });
    }

    if (event.target.value === '')
      setExperiments((prevState) => {
        return { ...prevState, searchedExperiments: data };
      });
  };

  return (
    <div className="bg-grey1 h-full p-6 rounded-md overflow-y-auto">
      <input
        className="bg-light text-dark px-3 py-1 w-full placeholder-grey1 mb-5 rounded-sm"
        placeholder="Search recent experiments ..."
        onChange={handleChange}
      />
      {experiments.searchedExperiments &&
        experiments.searchedExperiments.map((experiment: any) => (
          <RecentExperiment
            title={experiment.name}
            description={experiment.description}
            saved={experiment.updatedAt}
            key={experiment.id}
            isActive={experiment.id === currentExperimentId}
          />
        ))}
      {experiments.searchedExperiments.length === 0 && (
        <p className="text-white opacity-30">No recent experiment found.</p>
      )}
      {children}
    </div>
  );
};

export default withLoading(RecentExperimentsContainer, 'Loading Experiments');
