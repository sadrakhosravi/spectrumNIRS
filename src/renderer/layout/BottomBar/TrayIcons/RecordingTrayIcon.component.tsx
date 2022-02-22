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

  const settings = recordingData?.settings;

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
          {settings && settings?.probe && (
            <>
              <p>Probe: {settings.probe.name}</p>
              <p>Sampling Rate: {settings.probe.samplingRate}</p>
              <p>Device: {settings.probe.device.name}</p>
              <p>
                Channels: {settings.probe.device.defaultChannels.join(', ')}
              </p>
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
