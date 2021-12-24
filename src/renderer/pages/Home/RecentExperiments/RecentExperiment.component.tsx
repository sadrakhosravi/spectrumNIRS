import React from 'react';
import { useAppDispatch } from '@redux/hooks/hooks';
import { closeModal, openModal } from '@redux/ModalStateSlice';
import {
  resetExperimentData,
  setCurrentExperiment,
} from '@redux/ExperimentDataSlice';
import { changeRecordState } from '@redux/RecordStateSlice';
import { deleteExperimentAndData } from '@adapters/experimentAdapter';

// Icons
import RecentFileIcon from '@icons/recent-file.svg';

// Components
import ButtonTitleDescription from '@components/MicroComponents/ButtonTitleDescription/ButtonTitleDescription.component';
import DeleteButton from '@components/Buttons/DeleteButton.component';
// Constants
import { ModalConstants, RecordState } from '@utils/constants';
import { ExperimentChannels } from '@utils/channels';

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
    dispatch(closeModal());
    dispatch(setCurrentExperiment(experiment));
    dispatch(openModal(ModalConstants.OPEN_PATIENT));
    await window.api.invokeIPC(ExperimentChannels.UpdateExp, experiment.id);
  };

  return (
    <button
      className={`${
        isActive ? 'bg-accent' : 'bg-grey2 hover:bg-grey3 '
      } flex gap-2 items-center w-full mb-3 rounded-md hover:cursor-pointer`}
    >
      <div
        className="w-full flex px-3 py-5"
        onClick={handleOpenExperimentButton}
      >
        <div className="flex w-2/3 items-center">
          <span className="inline-block mr-5">
            <img
              className="my-auto"
              src={RecentFileIcon}
              width="48px"
              alt="File"
            />
          </span>
          <span className="inline-block">
            <ButtonTitleDescription title={title} description={description} />
          </span>
        </div>
        <div className="flex w-1/3 items-center justify-end mr-1">
          <span className="text-right">
            <p className="text-light text-sm">
              Last Saved: {saved.toString().split(', ')[0]}
            </p>
            <p className="text-light text-sm">
              Time: {saved.toString().split(', ')[1]}
            </p>
          </span>
        </div>
      </div>
      <DeleteButton
        className="mr-4"
        onClick={async () => {
          await deleteExperimentAndData(experiment.id, experiment.name);
          refetch();
        }}
        title="Delete Experiment and its Data"
      />
    </button>
  );
};

export default RecentExperiment;
