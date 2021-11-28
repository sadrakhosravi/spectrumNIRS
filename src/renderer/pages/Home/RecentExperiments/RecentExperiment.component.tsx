import React from 'react';
import { useAppDispatch } from '@redux/hooks/hooks';
import { closeModal, openModal } from '@redux/ModalStateSlice';
import {
  resetExperimentData,
  setCurrentExperiment,
} from '@redux/ExperimentDataSlice';
import { changeRecordState } from '@redux/RecordStateSlice';

// Icons
import RecentFileIcon from '@icons/recent-file.svg';

// Components
import ButtonTitleDescription from '@components/MicroComponents/ButtonTitleDescription/ButtonTitleDescription.component';

// Constants
import { ModalConstants, RecordState } from '@utils/constants';
import { ExperimentChannels } from '@utils/channels';

interface IProps {
  title: string;
  description: string;
  saved: string;
  experiment: any;
  isActive?: boolean;
  key?: any;
}

const RecentExperiment: React.FC<IProps> = ({
  title,
  description,
  saved,
  experiment,
  isActive = false,
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
        isActive ? 'bg-accent' : 'bg-grey2'
      } grid grid-cols-5 items-center w-full px-3 py-5 mb-3 rounded-md duration-150 hover:bg-grey3 hover:cursor-pointer active:bg-accent`}
      onClick={handleOpenExperimentButton}
    >
      <div className="col-span-3 flex items-center">
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
      <div className="col-span-2 flex items-center justify-end mr-1">
        <p className="text-light text-base">
          Saved: {saved.toString().split(' ')[0]}
        </p>
      </div>
    </button>
  );
};

export default RecentExperiment;
