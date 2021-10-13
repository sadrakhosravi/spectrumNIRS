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

  console.log(experimentData);

  let experimentButton = null,
    patientButton = null,
    sensorButton = null;

  if (experimentData.currentExperiment.name) {
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

  if (experimentData.currentExperiment.name) {
    sensorButton = (
      <>
        <Separator />
        <TrayIconButtons
          icon={SensorIcon}
          text={`Sensor: ${
            experimentData.currentSensor.name || 'No Sensor Selected'
          }`}
        />
      </>
    );
  }

  return (
    <footer className="text-right col-span-9 h-full grid grid-flow-col auto-cols-max justify-end">
      {experimentButton}
      {patientButton}
      {sensorButton}
    </footer>
  );
};

export default TrayIcons;
