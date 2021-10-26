import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import Separator from '@components/Separator/Separator.component';
import TrayIconButtons from '../TrayIconButton/TrayIconButton.component';

// Icons
import SensorIcon from '@icons/sensor.svg';
import PatientIcon from '@icons/user-checked.svg';
import ExperimentIcon from '@icons/experiment.svg';

// Constants
import { USBDetectionChannels } from '@utils/channels';
import { SensorState, setDetectedSensor } from '@redux/SensorStateSlice';
import { Sensors } from '@utils/constants';

const TrayIcons = () => {
  const dispatch = useDispatch();
  const experimentData = useSelector(
    (state: any) => state.experimentData.value
  );
  const sensorState: SensorState = useSelector(
    (state: any) => state.sensorState
  );

  console.log(sensorState);

  const checkUSBDevices = async () => {
    const usbDevices = await window.api.invokeIPC(
      USBDetectionChannels.CHECK_USB
    );
    usbDevices && dispatch(setDetectedSensor(Sensors.NIRSV5));
  };

  useEffect(() => {
    window.api.onIPCData(USBDetectionChannels.NIRSV5, (_event, data) => {
      data && dispatch(setDetectedSensor(Sensors.NIRSV5));
      !data && dispatch(setDetectedSensor(Sensors.NO_SENSOR));
    });

    checkUSBDevices();
  }, []);

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

  if (sensorState.detectedSensor) {
    sensorButton = (
      <>
        <Separator />
        <TrayIconButtons
          icon={SensorIcon}
          text={`Sensor: ${sensorState.detectedSensor || 'No Sensor Selected'}`}
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

export default React.memo(TrayIcons);
