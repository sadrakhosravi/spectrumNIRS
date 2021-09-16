import React from 'react';
import { useSelector } from 'react-redux';

// Components
import Separator from '@components/Separator/Separator.component';

// Icons
import SensorIcon from '@icons/sensor.svg';
import PatientIcon from '@icons/user-checked.svg';
import ExperimentIcon from '@icons/experiment.svg';

import TrayIconButtons from '../TrayIconButton/TrayIconButton.component';

const TrayIcons = () => {
  const experimentInfo = useSelector(
    (state: any) => state.experimentInfo.value
  );

  return (
    <footer className="text-right col-span-9 h-full grid grid-flow-col auto-cols-max justify-end">
      <Separator />
      <TrayIconButtons
        icon={ExperimentIcon}
        text={experimentInfo.experimentName}
      />
      <Separator />
      <TrayIconButtons icon={PatientIcon} text={experimentInfo.patientName} />
      <Separator />
      <TrayIconButtons icon={SensorIcon} text="Sensor: Connected" />
    </footer>
  );
};

export default TrayIcons;
