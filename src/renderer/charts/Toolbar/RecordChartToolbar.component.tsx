import React from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// Components
import ToolbarContainer from '@components/Toolbar/ToolbarContainer.component';
import TimeDiv from './TimeDiv.component';
import ActionButton from '@components/Buttons/ActionButton.component';
import Button from '@components/Buttons/Button.component';

// Icons
import StartIcon from '@icons/start.svg';
import PauseIcon from '@icons/pause.svg';
// import StopIcon from '@icons/stop.svg';
import ResetHeightIcon from '@icons/reset-height.svg';
import ChartScreenshotIcon from '@icons/chart-screenshot.svg';
import ExportIcon from '@icons/export-data.svg';
import MarkerIcon from '@icons/marker.svg';

// Constants
import { ChartType, ModalConstants } from '@utils/constants';
import { DialogBoxChannels, RecordChannels } from '@utils/channels';

// HOC
import withTooltip from '@hoc/withTooltip.hoc';
import { useChartContext } from 'renderer/context/ChartProvider';
import { openModal } from '@redux/ModalStateSlice';
import { getState, dispatch } from '@redux/store';

const ButtonWithTooltip = withTooltip(Button);

type RecordChartToolbarProps = {
  type: ChartType.RECORD | ChartType.REVIEW;
};

const RecordChartToolbar = ({}: RecordChartToolbarProps) => {
  const recordState = useAppSelector(
    (state) => state.global.recordState?.recordState
  );

  const { recordChart } = useChartContext();

  // Handle the start/pause/continue button
  const handleStart = async () => {
    switch (recordState) {
      case 'idle':
      case undefined:
        await window.api.invokeIPC(RecordChannels.Init);
        await window.api.invokeIPC(RecordChannels.Start);
        break;

      case 'pause':
        await window.api.invokeIPC(RecordChannels.Continue);
        break;

      case 'continue':
      case 'recording':
        await window.api.invokeIPC(RecordChannels.Pause);
        break;
    }
  };

  // Resets all channel's height back to default
  const resetChartHeights = () => {
    recordChart?.chartOptions?.resetChartsHeight();
  };

  const takeScreenShot = () => {
    recordChart?.chartOptions?.screenshot();
  };

  const exportData = () => {
    const recordingId = getState().global.recording?.currentRecording?.id;

    if (recordingId === -1 || !recordingId) {
      window.api.invokeIPC(DialogBoxChannels.MessageBox, {
        title: 'No recording found',
        type: 'error',
        message: 'No recording found',
        detail:
          'No recording found. Either open a recording or create a new one.',
      });
      return;
    }

    dispatch(openModal(ModalConstants.EXPORT_FORM));
  };

  const addEvent = () => {
    const currentInterval = recordChart?.charts[0]
      .getDefaultAxisX()
      .getInterval();
    recordChart?.chartOptions?.drawMarker(
      currentInterval?.end as number,
      'Hypoxia',
      '#E61557'
    );
  };
  const addEvent2 = () => {
    const currentInterval = recordChart?.charts[0]
      .getDefaultAxisX()
      .getInterval();
    recordChart?.chartOptions?.drawMarker(
      currentInterval?.end as number,
      'Other Event',
      '#8E07F0'
    );
  };

  return (
    <>
      <ToolbarContainer>
        <div className="flex h-full w-full items-center justify-between px-4">
          <div className="flex w-full items-center gap-5">
            <div className="flex gap-2">
              <ButtonWithTooltip
                icon={ResetHeightIcon}
                tooltip={'Reset Channel Heights'}
                onClick={resetChartHeights}
              />
            </div>

            <div className="flex gap-2">
              <ButtonWithTooltip
                icon={ChartScreenshotIcon}
                tooltip={'Take a Screenshot'}
                onClick={takeScreenShot}
              />
              <ButtonWithTooltip
                icon={ExportIcon}
                tooltip={'Export Data'}
                onClick={exportData}
              />
            </div>

            <div className="flex gap-2">
              <ButtonWithTooltip
                icon={MarkerIcon}
                tooltip={'Hypoxia Event'}
                onClick={addEvent}
              />
              <ButtonWithTooltip
                icon={MarkerIcon}
                tooltip={'Other Event'}
                onClick={addEvent2}
              />
            </div>

            <TimeDiv type={ChartType.RECORD} />
          </div>

          {/* Stop Start Button */}
          <div className="col-span-2 grid auto-cols-max grid-flow-col items-center justify-end gap-3">
            <div className="grid auto-cols-max grid-flow-col gap-3">
              <ActionButton
                text={
                  (recordState === 'idle' && 'Start') ||
                  (recordState === 'recording' && 'Pause') ||
                  (recordState === 'continue' && 'Pause') ||
                  (recordState === 'pause' && 'Continue') ||
                  'Start'
                }
                icon={
                  (recordState === 'idle' && StartIcon) ||
                  (recordState === 'recording' && PauseIcon) ||
                  StartIcon
                }
                onClick={handleStart}
                isActive={
                  (recordState === 'recording' && true) ||
                  (recordState === 'continue' && true) ||
                  false
                }
              />
              {/* <ActionButton
                text={'Stop'}
                icon={StopIcon}
                onDoubleClick={handleStop}
                darker={recordState !== 'idle' && recordState !== 'pause'}
                disabled={recordState !== 'idle' && recordState !== 'pause'}
              /> */}
            </div>
          </div>
        </div>
      </ToolbarContainer>
    </>
  );
};

export default RecordChartToolbar;
