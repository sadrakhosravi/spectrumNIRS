import React from 'react';
import { RecordButtons, RecordToolbar } from './RecordToolbar';

// Components
import Separator from '@components/Separator/Separator.component';
import IconButton from '@components/Buttons/IconButton.component';
import ActionButton from '@components/Buttons/ActionButton.component';
import withTooltip from '@hoc/withTooltip.hoc';
import TimeDivision from './TimeDivision.component';
import TimeDiv from './TimeDiv.component';

// Constants
import { ChartType } from '@utils/constants';
import { useAppSelector } from '@redux/hooks/hooks';
import { useChartContext } from 'renderer/context/ChartProvider';
import ChartOptions from '../ChartClass/ChartOptions';
import ToolbarContainer from '@components/Toolbar/ToolbarContainer.component';

// Buttons with tooltip
const IconButtonWithTooltip = withTooltip(IconButton);
const ActionButtonWithTooltip = withTooltip(ActionButton);

type RecordChartToolbarProps = {
  type: ChartType.RECORD | ChartType.REVIEW;
};
const RecordChartToolbar = ({
  type = ChartType.RECORD,
}: RecordChartToolbarProps) => {
  const recordState = useAppSelector((state) => state.recordState.value);
  const chartState = useAppSelector((state) => state.chartState) as any;
  const recordChart = useChartContext().recordChart;

  return (
    <>
      <ToolbarContainer>
        <div className="flex h-full w-full items-center justify-between px-4">
          {recordChart && (
            <>
              <div className="col-span-4 grid auto-cols-max grid-flow-col items-center gap-1">
                {RecordToolbar.map((option, index) => {
                  if (option.label === 'separator')
                    return <Separator orientation="vertical" key={index} />;
                  return (
                    <IconButtonWithTooltip
                      icon={option.icon}
                      isActive={chartState[option.label] || false}
                      onClick={() =>
                        option.click &&
                        option.click(recordChart.chartOptions as ChartOptions)
                      }
                      tooltip={
                        option.tooltip === 'timeDivision' ? (
                          <TimeDivision
                            chartOptions={
                              recordChart.chartOptions as ChartOptions
                            }
                          />
                        ) : (
                          option.tooltip
                        )
                      }
                      interactive={option.tooltip === 'timeDivision'}
                      key={index}
                      disabled={true}
                    />
                  );
                })}
                <TimeDiv />
              </div>

              {/* Stop Start Button */}
              <div className="col-span-2 grid auto-cols-max grid-flow-col items-center justify-end gap-3">
                <div className="grid auto-cols-max grid-flow-col gap-3">
                  {type === ChartType.RECORD
                    ? RecordButtons.map((button, index) => (
                        <ActionButtonWithTooltip
                          text={button.dynamicLabel(recordState)}
                          icon={button.dynamicIcon(recordState)}
                          darker
                          isActive={button.isActive(recordState)}
                          onClick={button.click(recordState)}
                          key={index}
                        />
                      ))
                    : RecordButtons.map((button, index) => (
                        <ActionButtonWithTooltip
                          text={`Status: ${button.dynamicLabel(recordState)}`}
                          icon={button.dynamicIcon(recordState)}
                          darker
                          isActive={button.isActive(recordState)}
                          disabled
                          key={index}
                        />
                      ))}
                </div>
              </div>
            </>
          )}
        </div>
      </ToolbarContainer>
    </>
  );
};

export default RecordChartToolbar;
