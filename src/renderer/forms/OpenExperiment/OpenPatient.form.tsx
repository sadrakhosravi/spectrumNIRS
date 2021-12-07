import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// Components
import SelectPatient from './SelectPatient.component';

// Constants
import { ExperimentChannels } from '@utils/channels';

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
  const getAllPatients = async () => {
    const allPatients = await window.api.invokeIPC(
      ExperimentChannels.getAllPatients,
      experimentId
    );
    allPatients && setPatients(allPatients);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      getAllPatients();
    });
  }, []);

  return (
    <div>
      <ul className="w-full">
        {patients &&
          patients.map((patient) => (
            <SelectPatient
              patient={patient}
              key={patient.id}
              getAllPatients={getAllPatients}
            />
          ))}
      </ul>
    </div>
  );
};
export default OpenPatientForm;
