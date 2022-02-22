import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@redux/hooks/hooks';
import { closeModal, openModal } from '@redux/ModalStateSlice';
import {
  deleteRecordingAndData,
  deletePatientAndData,
} from '@adapters/experimentAdapter';

// Components
import DeleteButton from '@components/Buttons/DeleteButton.component';
import BorderIconButton from '@components/Buttons/BorderIconButton.component';

// Icons
import PatientIcon from '@icons/user-checked.svg';
import ArrowDownIcon from '@icons/arrow-down.svg';
import RecordingIcon from '@icons/recording.svg';
import NewRecordingIcon from '@icons/new-file.svg';

// Constants
import { ExperimentChannels } from '@utils/channels';
import { ModalConstants } from '@utils/constants';

type PatientData = {
  createdAt: string;
  description: string;
  dob: string;
  experimentId: number;
  id: number;
  name: string;
  updatedAt: string;
};

const SelectPatient = ({
  patient,
  getAllPatients,
}: {
  patient: PatientData;
  getAllPatients: any;
}) => {
  const [recordings, setRecordings] = useState<null | any[]>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const getAllRecordings = async (patientId: number) => {
    const recordings = await window.api.invokeIPC(
      ExperimentChannels.getAllRecordings,
      patientId
    );
    console.log(recordings);
    setRecordings(recordings);
  };

  const handleOpenRecordingButton = async (recording: any) => {
    await window.api.invokeIPC(
      ExperimentChannels.GetAndUpdateRecording,
      recording.id
    );
    dispatch(closeModal());
  };

  useEffect(() => {
    (async () => {
      isOpen
        ? await window.api.invokeIPC(
            ExperimentChannels.GetAndUpdatePatient,
            patient.id
          )
        : await window.api.invokeIPC(ExperimentChannels.RemovePatient);
    })();
  }, [isOpen]);

  return (
    <>
      <div
        className="w-full cursor-pointer rounded-md bg-grey2 duration-150 hover:bg-grey3 focus:bg-grey3"
        key={patient.id}
      >
        <div className="flex w-full items-center gap-2 pr-4">
          <div
            className="flex h-full w-full items-center gap-5 p-6 pr-2"
            onClick={() => {
              getAllRecordings(patient.id);
              setIsOpen(!isOpen);
            }}
          >
            <span className="w-[40px]">
              <img src={PatientIcon} width="40px" />
            </span>
            <span className="w-2/3 text-left text-lg">{patient.name}</span>
            <span className="w-1/3 text-right">
              Last Update: {patient.updatedAt.split(' ')[0]}
            </span>
            <span className="mb-1 w-[25px]">
              <img
                className={`duration-300 ${
                  isOpen ? 'rotate-0' : 'rotate-180'
                } mt-2`}
                src={ArrowDownIcon}
                width="25px"
              />
            </span>
          </div>
          <DeleteButton
            onClick={async () => {
              await deletePatientAndData(patient.id, patient.name);
              getAllPatients();
            }}
            title="Delete Patient and its Data"
          />
        </div>
      </div>
      <div
        className="-mt-1 w-full border-t-2 border-grey1 bg-grey3 px-6  pt-6 pb-20 text-left"
        hidden={!isOpen}
      >
        {recordings &&
          recordings.map((recording: any, index: number) => (
            <div
              className="inline-block w-full rounded-sm border-b-2 border-light2 last:border-b-0"
              key={recording + index}
            >
              <button
                className="flex w-full  items-center gap-4 rounded-sm bg-grey1 text-left hover:bg-accent"
                key={recording.id}
              >
                <div
                  className="flex w-full items-center px-4 py-2"
                  onClick={() => handleOpenRecordingButton(recording)}
                >
                  <span className="w-[40px]">
                    <img src={RecordingIcon} width="30px" />
                  </span>
                  <span className="w-2/3 font-medium">
                    Recording{index + 1}: {recording.name}
                  </span>
                  <span className="w-1/3 text-right">
                    {recording.updatedAt.split(' ')[0]}
                  </span>
                </div>
                <DeleteButton
                  onClick={async () => {
                    await deleteRecordingAndData(recording.id, recording.name);
                    // Refresh the list
                    setTimeout(() => {
                      getAllRecordings(patient.id);
                    }, 300);
                  }}
                  title="Delete Recording and its Data"
                />
              </button>
            </div>
          ))}
        {recordings?.length === 0 && (
          <p>
            No recordings found for the patient:{' '}
            <span className="text-lg font-medium text-accent text-opacity-75">
              {patient.name}
            </span>
          </p>
        )}

        <div className="absolute bottom-4 right-6">
          <BorderIconButton
            tooltip="Create a recording for this patient"
            icon={NewRecordingIcon}
            onClick={() => {
              dispatch(openModal(ModalConstants.NEWRECORDING));
            }}
          />
        </div>
      </div>

      <div className="mb-6"></div>
    </>
  );
};
export default SelectPatient;
