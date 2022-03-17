import React from 'react';
import { dispatch, getState } from '@redux/store';

import { openModal } from '@redux/ModalStateSlice';

// Components
import ToolbarContainer from '@components/Toolbar/ToolbarContainer.component';
import Button from '@components/Buttons/Button.component';
import withTooltip from '@hoc/withTooltip.hoc';
import TimeDiv from './TimeDiv.component';

// import StopIcon from '@icons/stop.svg';
import ResetHeightIcon from '@icons/reset-height.svg';
import ChartScreenshotIcon from '@icons/chart-screenshot.svg';
import ExportIcon from '@icons/export-data.svg';

// Constants
import { ChartType, ModalConstants } from '@utils/constants';
import { DialogBoxChannels } from '@utils/channels';

import { useChartContext } from 'renderer/context/ChartProvider';

// Buttons with tooltip
const ButtonWithTooltip = withTooltip(Button);

type ReviewChartToolbarProps = {
  type?: ChartType.RECORD | ChartType.REVIEW;
};
const ReviewChartToolbar = ({}: ReviewChartToolbarProps) => {
  const reviewChart = useChartContext().reviewChart;

  // Resets all channel's height back to default
  const resetChartHeights = () => {
    reviewChart?.chartOptions?.resetChartsHeight();
  };

  const takeScreenShot = () => {
    reviewChart?.chartOptions?.screenshot();
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

  return (
    <>
      {reviewChart && (
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

                <TimeDiv type={ChartType.REVIEW} />
              </div>

              {/* Stop Start Button */}
              <div className="col-span-2 grid auto-cols-max grid-flow-col items-center justify-end gap-3">
                <div className="grid auto-cols-max grid-flow-col gap-3"></div>
              </div>
            </div>
          </ToolbarContainer>
        </>
      )}
    </>
  );
};

export default ReviewChartToolbar;
