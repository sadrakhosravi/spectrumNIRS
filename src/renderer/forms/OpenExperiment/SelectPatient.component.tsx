import React, { useState } from 'react';
import { useAppDispatch } from '@redux/hooks/hooks';
import { setPatientData, setRecordingData } from '@redux/ExperimentDataSlice';
import { closeModal } from '@redux/ModalStateSlice';
import { changeAppState } from '@redux/AppStateSlice';

// Icons
import PatientIcon from '@icons/user-checked.svg';
import ArrowDownIcon from '@icons/arrow-down.svg';
import RecordingIcon from '@icons/raw-data.svg';

// Constants
import { ExperimentChannels } from '@utils/channels';
import { AppState } from '@utils/constants';

type PatientData = {
  createdAt: string;
  description: string;
  dob: string;
  experimentId: number;
  id: number;
  name: string;
  updatedAt: string;
};

const SelectPatient = ({ patient }: { patient: PatientData }) => {
  const [recordings, setRecordings] = useState<null | any[]>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const getAllRecordings = async (patientId: number) => {
    const recordings = await window.api.invokeIPC(
      ExperimentChannels.getAllRecordings,
      patientId
    );
    setRecordings(recordings);
  };

  const handleOpenRecordingButton = (recording: any) => {
    dispatch(setPatientData(patient));
    dispatch(setRecordingData(recording));
    dispatch(closeModal());
    dispatch(changeAppState(AppState.REVIEW));
  };

  return (
    <>
      <button
        className="w-full p-6 bg-grey2 hover:bg-grey3 cursor-pointer focus:bg-grey3 duration-150 rounded-md"
        onClick={() => {
          getAllRecordings(patient.id);
          setIsOpen(!isOpen);
        }}
        key={patient.id}
      >
        <div className="flex items-center w-full gap-5">
          <span className="w-[40px]">
            <img src={PatientIcon} width="40px" />
          </span>
          <span className="text-lg w-2/3 text-left">{patient.name}</span>
          <span className="w-1/3 text-right">
            Last Update: {patient.updatedAt.split(' ')[0]}
          </span>
          <span className="w-[25px] mb-1">
            <img
              className={`duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`}
              src={ArrowDownIcon}
              width="25px"
            />
          </span>
        </div>
      </button>
      <div
        className="w-full -mt-1 p-6 bg-grey3 pt-6 border-t-2 border-grey1 text-left"
        hidden={!isOpen}
      >
        {recordings &&
          recordings.map((recording: any, index: number) => (
            <div className="inline-block w-1/2 px-2">
              <button
                className="bg-grey1 hover:bg-accent p-4 w-full text-left flex items-center gap-4 rounded-sm border-accent border-2 "
                onClick={() => handleOpenRecordingButton(recording)}
                key={recording.id}
              >
                <span className="w-[40px]">
                  <img src={RecordingIcon} width="40px" />
                </span>
                <span className="w-2/3 text-lg font-medium">
                  Recording{index + 1}: {recording.name}
                </span>
                <span className="w-1/3 text-right">
                  {recording.updatedAt.split(' ')[0]}
                </span>
              </button>
            </div>
          ))}
        {recordings?.length === 0 && (
          <p>No recordings found for patient {patient.name}</p>
        )}
      </div>
      <div className="mb-6"></div>
    </>
  );
};
export default SelectPatient;
