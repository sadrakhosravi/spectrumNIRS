import React, { useEffect } from 'react';

// Components
import ExperimentTrayIcon from './ExperimentTrayIcon.component';
import PatientTrayIcon from './PatientTrayIcon.component copy';
import RecordingTrayIcon from './RecordingTrayIcon.component';

// Constants
import exportServerListeners from './ExportServerListeners';

// const TrayIconWithTooltip = withTooltip(TrayIconButtons);

const TrayIcons = () => {
  exportServerListeners();

  // Get sensor info on mount.
  useEffect(() => {
    // // Send a request to the controller to get the sensor info and set it in the state.
    // const checkUSBDevices = async () => {
    //   const connectedSensor = null;
    //   dispatch(setDetectedSensor(connectedSensor));
    // };
    // const handleUSBStatus = (_event: any, data: any) => {
    //   dispatch(setDetectedSensor(data));
    // };
    // window.api.onIPCData(USBDetectionChannels.NIRSV5, handleUSBStatus);
    // checkUSBDevices();
    // return () => window.api.removeListeners(USBDetectionChannels.NIRSV5);
  }, []);

  // // Tooltip for sensor icon.
  // const sensorTooltip = (
  //   <div className="px-2 py-2 text-left">
  //     <h2 className="mb-1 text-xl text-accent">Sensor Information</h2>

  //     <div className="ml-4">
  //       {!sensorState.detectedSensor && <p>No sensor found!</p>}
  //       {sensorState.detectedSensor && (
  //         <>
  //           <p>Name: {sensorState.detectedSensor?.name}</p>
  //           <p>Channels: </p>
  //           <p>Rate: 100 samples/s</p>
  //         </>
  //       )}
  //     </div>
  //   </div>
  // );

  // Fix layout issue with margin bottom.
  const SeparatorBar = <div className="mb-[5px]"></div>;

  return (
    <div className="col-span-9 h-30px text-right">
      <div className="grid grid-flow-col items-center justify-end pb-2">
        <ExperimentTrayIcon />
        <PatientTrayIcon />
        <RecordingTrayIcon />
        {SeparatorBar}
        {/* <TrayIconWithTooltip
          icon={SensorIcon}
          text={`${
            sensorState.detectedSensor?.name
              ? `Sensor(s): ${sensorState.detectedSensor.name} ✅`
              : 'No Sensor Found ❌'
          }`}
          tooltip={sensorTooltip}
          interactive
        /> */}
      </div>
    </div>
  );
};

export default TrayIcons;
