import React from 'react';
import { useAppDispatch } from '@redux/hooks/hooks';
import { closeModal, openModal } from '@redux/ModalStateSlice';
import { resetExperimentData } from '@redux/ExperimentDataSlice';
import { changeRecordState } from '@redux/RecordStateSlice';
import { deleteExperimentAndData } from '@adapters/experimentAdapter';

// Icons
import RecentFileIcon from '@icons/recent-file.svg';

// Constants
import { ModalConstants, RecordState } from '@utils/constants';
import { ExperimentChannels } from '@utils/channels';
import ListButton from '@components/Buttons/ListButton';

interface IProps {
  title: string;
  description: string;
  saved: string;
  experiment: any;
  isActive?: boolean;
  refetch: any;
}

const RecentExperiment: React.FC<IProps> = ({
  title,
  description,
  saved,
  experiment,
  isActive = false,
  refetch,
}) => {
  const dispatch = useAppDispatch();

  const handleOpenExperimentButton = async () => {
    dispatch(resetExperimentData());
    dispatch(changeRecordState(RecordState.IDLE));

    // Get the experiment from DB
    await window.api.invokeIPC(
      ExperimentChannels.GetAndUpdateExp,
      experiment.id
    );

    dispatch(closeModal());
    dispatch(openModal(ModalConstants.OPEN_PATIENT));
  };

  return (
    <ListButton
      isActive={isActive}
      onClick={handleOpenExperimentButton}
      icon={RecentFileIcon}
      text={title}
      description={description}
      time={saved}
      deleteOnClick={async () => {
        await deleteExperimentAndData(experiment.id, experiment.name);
        refetch();
      }}
      className="py-2"
    />
  );
};

export default RecentExperiment;
