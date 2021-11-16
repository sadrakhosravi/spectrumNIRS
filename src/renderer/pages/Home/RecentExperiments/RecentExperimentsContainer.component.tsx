import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';
import { useGetRecentExperimentsQuery } from '@redux/api/experimentsApi';

// Components
import RecentExperiment from './RecentExperiment.component';
import IconButton from '@components/Buttons/IconButton.component';

// HOC
import withLoading from '@hoc/withLoading.hoc';
import withTooltip from '@hoc/withTooltip.hoc';

// Icons
import UpdateIcon from '@icons/update.svg';

const IconButtonWithTooltip = withTooltip(IconButton);

type ExperimentsContainer = {
  numOfExps?: number;
  recentExperiments?: Object[];
  children?: React.ReactNode;
  setLoading?: any;
};

type ExperimentState = {
  data: any[];
  searchedExperiments: any[];
};

const RecentExperimentsContainer = ({
  numOfExps = 5,
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

  const { data, isLoading, refetch } = useGetRecentExperimentsQuery(numOfExps);

  useEffect(() => {
    refetch();
  }, [currentExperimentId]);
  // Handle side effects
  useEffect(() => {
    setLoading(isLoading);
    !isLoading && setExperiments({ data, searchedExperiments: data });
  }, [isLoading, data]);

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
      <div className="flex gap-2 items-center w-full mb-5">
        <input
          className="bg-light text-dark h-40px px-3 placeholder-grey1 rounded-sm w-full"
          placeholder="Search recent experiments ..."
          onChange={handleChange}
        />
        <span className="h-40px w-12">
          <IconButtonWithTooltip
            icon={UpdateIcon}
            tooltip={'Refresh List'}
            onClick={refetch}
          />
        </span>
      </div>
      {experiments.searchedExperiments &&
        experiments.searchedExperiments.map((experiment: any) => (
          <RecentExperiment
            title={experiment.name}
            description={experiment.description}
            saved={experiment.updatedAt}
            key={experiment.id}
            isActive={experiment.id === currentExperimentId}
            experiment={experiment}
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
