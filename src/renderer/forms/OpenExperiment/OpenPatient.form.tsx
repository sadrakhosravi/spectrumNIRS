import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';
import { openModal } from '@redux/ModalStateSlice';

// Components
import SelectPatient from './SelectPatient.modal';

// Icons
import NewPatientIcon from '@icons/new-user.svg';

// Constants
import { ExperimentChannels } from '@utils/channels';
import { ModalConstants } from '@utils/constants';
import BorderIconButton from '@components/Buttons/BorderIconButton.component';

type PatientData = {
  createdAt: string;
  description: string;
  dob: string;
  experimentId: number;
  id: number;
  name: string;
  updatedAt: string;
};

const OpenPatientForm = () => {
  const [patients, setPatients] = useState<null | PatientData[]>(null);
  const experimentId = useAppSelector(
    (state) => state.experimentData.currentExperiment.id
  );
  const dispatch = useAppDispatch();

  const getAllPatients2 = async () => {
    const allPatients = await window.api.invokeIPC(
      ExperimentChannels.getAllPatients,
      experimentId
    );
    allPatients && setPatients(allPatients);
  };

  useEffect(() => {
    const getAllPatients = async () => {
      const allPatients = await window.api.invokeIPC(
        ExperimentChannels.getAllPatients,
        experimentId
      );
      allPatients && setPatients(allPatients);
    };
    setTimeout(() => {
      getAllPatients();
    }, 100);
  }, []);

  const handleOpenNewPatientForm = () => {
    dispatch(openModal(ModalConstants.NEWPATIENT));
  };

  return (
    <div className="pb-10">
      <ul className="w-full">
        {patients &&
          patients.map((patient) => (
            <SelectPatient
              patient={patient}
              key={patient.id}
              getAllPatients={getAllPatients2}
            />
          ))}
        {patients?.length === 0 && (
          <p className="text-white text-opacity-50">
            No patients found for this experiment
          </p>
        )}
      </ul>

      <div className="absolute bottom-0 right-0">
        <BorderIconButton
          tooltip="Create a new patient for this experiment"
          icon={NewPatientIcon}
          onClick={handleOpenNewPatientForm}
        />
      </div>
    </div>
  );
};
export default OpenPatientForm;
