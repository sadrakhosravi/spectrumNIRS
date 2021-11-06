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
import { setDetectedSensor } from '@redux/SensorStateSlice';
import withTooltip from '@hoc/withTooltip.hoc';

const TrayIconWithTooltip = withTooltip(TrayIconButtons);

const TrayIcons = () => {
  const dispatch = useDispatch();
  const experimentData = useSelector((state: any) => state.experimentData);
  const sensorState: any = useSelector((state: any) => state.sensorState);

  const checkUSBDevices = async () => {
    const connectedSensor = await window.api.invokeIPC(
      USBDetectionChannels.CHECK_USB
    );
    dispatch(setDetectedSensor(connectedSensor));
  };

  useEffect(() => {
    window.api.onIPCData(USBDetectionChannels.NIRSV5, (_event, data) => {
      console.log(data);
      dispatch(setDetectedSensor(data));
    });

    checkUSBDevices();
  }, []);

  const experimentTooltipText = (
    <div className="px-2 py-2 text-left">
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

  // Fix layout issue with margin bottom
  const SeparatorBar = (
    <div className="mb-[5px]">
      <Separator />
    </div>
  );

  if (experimentData.currentExperiment.name) {
    experimentButton = (
      <>
        {SeparatorBar}
        <TrayIconWithTooltip
          icon={ExperimentIcon}
          text={`Experiment: ${experimentData.currentExperiment.name}`}
          tooltip={experimentTooltipText}
          interactive
        />
      </>
    );

    patientButton = (
      <>
        {SeparatorBar}

        <Separator />
        <TrayIconWithTooltip
          icon={PatientIcon}
          text={`Patient: ${experimentData.currentPatient.name}`}
          tooltip={experimentTooltipText}
          interactive
        />
      </>
    );
  }

  return (
    <footer className="text-right col-span-9 h-30px">
      <div className="grid grid-flow-col items-center justify-end pb-2">
        {experimentButton}
        {patientButton}
        {SeparatorBar}
        <TrayIconWithTooltip
          icon={SensorIcon}
          tooltip={
            sensorState.detectedSensor?.name ? (
              <p>Sensor Status: Connected</p>
            ) : (
              <p>Sensor Status: No Sensor Found</p>
            )
          }
          text={`Sensor: ${
            sensorState.detectedSensor?.name || 'Not Connected ❌'
          }`}
        />
      </div>
    </footer>
  );
};

export default TrayIcons;
