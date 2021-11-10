import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@redux/hooks/hooks';

// Components
import Separator from '@components/Separator/Separator.component';
import TrayIconButtons from '../TrayIconButton/TrayIconButton.component';

// Icons
import SensorIcon from '@icons/sensor.svg';
import PatientIcon from '@icons/user-checked.svg';
import ExperimentIcon from '@icons/experiment.svg';
import DataIcon from '@icons/raw-data.svg';

// Constants
import { USBDetectionChannels } from '@utils/channels';
import { setDetectedSensor } from '@redux/SensorStateSlice';
import withTooltip from '@hoc/withTooltip.hoc';

const TrayIconWithTooltip = withTooltip(TrayIconButtons);

const TrayIcons = () => {
  const dispatch = useAppDispatch();
  const experimentData = useAppSelector((state) => state.experimentData);
  const sensorState = useAppSelector((state) => state.sensorState);

  // Send a request to the controller to get the sensor info and set it in the state.
  const checkUSBDevices = async () => {
    const connectedSensor = await window.api.invokeIPC(
      USBDetectionChannels.CHECK_USB
    );
    dispatch(setDetectedSensor(connectedSensor));
  };

  // Get sensor info on mount.
  useEffect(() => {
    window.api.onIPCData(USBDetectionChannels.NIRSV5, (_event, data) => {
      console.log(data);
      dispatch(setDetectedSensor(data));
    });

    checkUSBDevices();
  }, []);

  // Tooltip for experiment and patient icons.
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
        <p>DOB: {experimentData.currentPatient.dob}</p>
        <p>Description: {experimentData.currentPatient.description}</p>
      </div>
    </div>
  );

  // Recording tooltip
  const recordingTooltip = (
    <div className="px-2 py-2 text-left">
      <h2 className="text-xl text-accent mb-1">Recording</h2>

      <div className="ml-4">
        <p>Name: {experimentData.currentRecording.name}</p>
        <p>Date: {experimentData.currentRecording.date}</p>
        <p>Description: {experimentData.currentRecording.description}</p>
      </div>
    </div>
  );

  // Tooltip for sensor icon.
  const sensorTooltip = (
    <div className="px-2 py-2 text-left">
      <h2 className="text-xl text-accent mb-1">Sensor Information</h2>

      <div className="ml-4">
        {!sensorState.detectedSensor && <p>No sensor found!</p>}
        {sensorState.detectedSensor && (
          <>
            <p>Name: {sensorState.detectedSensor?.name}</p>
            <p>Channels: {sensorState.detectedSensor?.channels.toString()}</p>
            <p>Rate: {sensorState.detectedSensor?.samplingRate} samples/s</p>
          </>
        )}
      </div>
    </div>
  );

  let experimentButton = null,
    patientButton = null,
    recordingButton = null;

  // Fix layout issue with margin bottom.
  const SeparatorBar = (
    <div className="mb-[5px]">
      <Separator />
    </div>
  );

  // When experiment data is available
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
  }

  // When patient data is available
  if (experimentData.currentPatient.name) {
    patientButton = (
      <>
        {SeparatorBar}

        <TrayIconWithTooltip
          icon={PatientIcon}
          text={`Patient: ${experimentData.currentPatient.name}`}
          tooltip={experimentTooltipText}
          interactive
        />
      </>
    );
  }

  // When recording data is available
  if (experimentData.currentRecording.name) {
    recordingButton = (
      <>
        {SeparatorBar}

        <TrayIconWithTooltip
          icon={DataIcon}
          text={`Recording: ${experimentData.currentRecording.name}`}
          tooltip={recordingTooltip}
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
        {recordingButton}
        {SeparatorBar}
        <TrayIconWithTooltip
          icon={SensorIcon}
          text={`Sensor: ${
            sensorState.detectedSensor?.name
              ? `${sensorState.detectedSensor.name} ✅`
              : 'Not Connected ❌'
          }`}
          tooltip={sensorTooltip}
          interactive
        />
      </div>
    </footer>
  );
};

export default TrayIcons;
