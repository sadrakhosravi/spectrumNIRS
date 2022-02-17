import React from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

import withTooltip from '@hoc/withTooltip.hoc';
import TrayIconButtons from './TrayIconButton.component';

import RecordingIcon from '@icons/recording.svg';
import { CurrentProbe } from '@electron/models/ProbesManager';

const TrayIconWithTooltip = withTooltip(TrayIconButtons);

const RecordingTrayIcon = () => {
  const recordingData = useAppSelector(
    (state) => state.global.recording?.currentRecording
  );

  const settings: CurrentProbe | undefined = recordingData?.settings;

  let patientTooltipText = null;

  if (recordingData) {
    patientTooltipText = (
      <div className="px-2 py-2 text-left">
        <h2 className="mb-1 text-xl text-accent">Recording Info</h2>

        <div className="ml-4">
          <p>Name: {recordingData.name}</p>
          <p>DOB: {recordingData.date}</p>
          {recordingData?.description && (
            <p>Description: {recordingData?.description}</p>
          )}
          {recordingData?.settings && (
            <>
              <p>Probe: {settings?.name}</p>
              <p>Sampling Rate: {settings?.samplingRate}</p>
              <p>Device: {settings?.device.name}</p>
              <p>Channels: {settings?.device.defaultChannels.join(', ')}</p>
            </>
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
