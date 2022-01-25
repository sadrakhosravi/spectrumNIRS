import React from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

import withTooltip from '@hoc/withTooltip.hoc';
import TrayIconButtons from './TrayIconButton.component';

import RecordingIcon from '@icons/recording.svg';

const TrayIconWithTooltip = withTooltip(TrayIconButtons);

const RecordingTrayIcon = () => {
  const recordingData = useAppSelector(
    (state) => state.global.recording?.currentRecording
  );
  console.log(recordingData);

  let patientTooltipText = null;

  if (recordingData) {
    patientTooltipText = (
      <div className="px-2 py-2 text-left">
        <h2 className="text-xl text-accent mb-1">Patient</h2>

        <div className="ml-4">
          <p>Name: {recordingData?.name}</p>
          <p>DOB: {recordingData.dob}</p>
          {recordingData?.description && (
            <p>Description: {recordingData?.description}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {recordingData && (
        <TrayIconWithTooltip
          icon={RecordingIcon}
          text={`Recording: ${recordingData?.name}`}
          tooltip={patientTooltipText}
          interactive
        />
      )}
    </>
  );
};
export default RecordingTrayIcon;
