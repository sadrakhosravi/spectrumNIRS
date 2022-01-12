import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';
import { useGetRecentExperimentsQuery } from '@redux/api/experimentsApi';

// Components
import Container from '@components/Containers/Container.component';
import RecentExperiment from './RecentExperiment.component';
import IconButton from '@components/Buttons/IconButton.component';

// HOC
import withLoading from '@hoc/withLoading.hoc';
import withTooltip from '@hoc/withTooltip.hoc';

// Icons
import RefreshIcon from '@icons/refresh.svg';
import NewFileIcon from '@icons/new-file.svg';
import { openModal } from '@redux/ModalStateSlice';

// Constants
import { ModalConstants } from '@utils/constants';

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
  const dispatch = useAppDispatch();

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
    <Container>
      <div className="flex gap-2 items-center w-full mb-5">
        <input
          className="bg-light text-dark h-40px px-3 placeholder-grey1 rounded-sm w-full focus:ring-2 focus:ring-accent"
          placeholder="Search recent experiments ..."
          onChange={handleChange}
        />
        <span className="h-40px w-12">
          <IconButtonWithTooltip
            icon={RefreshIcon}
            tooltip={'Refresh List'}
            onClick={refetch}
          />
        </span>
        <span className="h-40px w-12">
          <IconButtonWithTooltip
            icon={NewFileIcon}
            tooltip={'New Experiment'}
            onClick={() => dispatch(openModal(ModalConstants.NEWEXPERIMENT))}
          />
        </span>
      </div>
      {experiments.searchedExperiments &&
        experiments.searchedExperiments.map((experiment: any) => (
          <RecentExperiment
            title={experiment.name}
            description={experiment.description}
            saved={experiment.lastUpdate}
            key={experiment.id}
            isActive={experiment.id === currentExperimentId}
            experiment={experiment}
            refetch={refetch}
          />
        ))}
      {experiments.searchedExperiments.length === 0 && (
        <p className="text-white opacity-30">No recent experiment found.</p>
      )}
      {children}
    </Container>
  );
};

export default withLoading(RecentExperimentsContainer, 'Loading Experiments');
