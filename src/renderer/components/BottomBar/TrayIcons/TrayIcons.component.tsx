import React from 'react';
import { useSelector } from 'react-redux';

// Components
import Separator from '@components/Separator/Separator.component';

// Icons
import SensorIcon from '@icons/sensor.svg';
import PatientIcon from '@icons/user-checked.svg';
import ExperimentIcon from '@icons/experiment.svg';

// Components
import TrayIconButtons from '../TrayIconButton/TrayIconButton.component';

const TrayIcons = () => {
  const experimentData = useSelector(
    (state: any) => state.experimentData.value
  );

  let experimentButton = null,
    patientButton = null;

  if (Object.keys(experimentData).length !== 0) {
    experimentButton = (
      <>
        <TrayIconButtons
          icon={ExperimentIcon}
          text={`Experiment: ${experimentData.currentExperiment.name}`}
        />
      </>
    );

    patientButton = (
      <>
        <Separator />
        <TrayIconButtons
          icon={PatientIcon}
          text={`Patient: ${experimentData.currentPatient.name}`}
        />
      </>
    );
  }

  return (
    <footer className="text-right col-span-9 h-full grid grid-flow-col auto-cols-max justify-end">
      {experimentButton}
      {patientButton}
      <Separator />
      <TrayIconButtons icon={SensorIcon} text="Sensor: Connected" />
    </footer>
  );
};

export default TrayIcons;
