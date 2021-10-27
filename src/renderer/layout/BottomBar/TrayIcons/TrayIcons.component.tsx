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
import withTooltip from '@hoc/withTooltip.hoc';

const TrayIconWithTooltip = withTooltip(TrayIconButtons);

const TrayIcons = () => {
  const dispatch = useDispatch();
  const experimentData = useSelector(
    (state: any) => state.experimentData.value
  );
  const sensorState: SensorState = useSelector(
    (state: any) => state.sensorState
  );

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

  const experimentTooltipText = (
    <div className="px-2 py-2">
      <h2 className="text-xl text-accent mb-1">Experiment</h2>

      <div className="ml-4">
        <p>Name: {experimentData.currentExperiment.name}</p>
        <p>Date: {experimentData.currentExperiment.date}</p>
        <p>Description: {experimentData.currentExperiment.description}</p>
      </div>
      <h2 className="text-xl text-accent mt-2">Patient</h2>
      <div className="ml-4">
        <p>Name: {experimentData.currentPatient.name}</p>
        <p>Date: {experimentData.currentPatient.dob}</p>
        <p>Description: {experimentData.currentPatient.description}</p>
      </div>
    </div>
  );

  let experimentButton = null,
    patientButton = null;

  if (experimentData.currentExperiment.name) {
    experimentButton = (
      <>
        <TrayIconWithTooltip
          icon={ExperimentIcon}
          text={`Experiment: ${experimentData.currentExperiment.name}`}
          tooltip={experimentTooltipText}
        />
      </>
    );

    patientButton = (
      <>
        <Separator />
        <TrayIconWithTooltip
          icon={PatientIcon}
          text={`Patient: ${experimentData.currentPatient.name}`}
          tooltip={experimentTooltipText}
        />
      </>
    );
  }

  return (
    <footer className="text-right col-span-9 h-30px grid grid-flow-col auto-cols-max justify-end">
      {experimentButton}
      {patientButton}
      <Separator />
      <TrayIconWithTooltip
        icon={SensorIcon}
        tooltip={
          sensorState.detectedSensor === Sensors.NIRSV5 ? (
            <p>Sensor Status: Connected</p>
          ) : (
            <p>Sensor Status: No Sensor Found</p>
          )
        }
        text={`Sensor: ${sensorState.detectedSensor || 'Not Connected ❌'}`}
      />
    </footer>
  );
};

export default React.memo(TrayIcons);
