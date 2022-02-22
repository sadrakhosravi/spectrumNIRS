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
import StopIcon from '@icons/stop.svg';
import ResetHeightIcon from '@icons/reset-height.svg';

// Constants
import { ChartType } from '@utils/constants';
import { RecordChannels } from '@utils/channels';

// HOC
import withTooltip from '@hoc/withTooltip.hoc';

const ButtonWithTooltip = withTooltip(Button);

type RecordChartToolbarProps = {
  type: ChartType.RECORD | ChartType.REVIEW;
};

const RecordChartToolbar = ({}: RecordChartToolbarProps) => {
  const recordState = useAppSelector(
    (state) => state.global.recordState?.recordState
  );

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

  const handleStop = async () => {};

  console.log(recordState);

  return (
    <>
      <ToolbarContainer>
        <div className="flex h-full w-full items-center justify-between px-4">
          <div className="flex w-full items-center gap-4">
            <ButtonWithTooltip
              icon={ResetHeightIcon}
              tooltip={'Reset Channel Heights'}
            />
            <TimeDiv />
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
              <ActionButton
                text={'Stop'}
                icon={StopIcon}
                onClick={handleStop}
                darker={recordState !== 'idle' && recordState !== 'pause'}
                disabled={recordState !== 'idle' && recordState !== 'pause'}
              />
            </div>
          </div>
        </div>
      </ToolbarContainer>
    </>
  );
};

export default RecordChartToolbar;
