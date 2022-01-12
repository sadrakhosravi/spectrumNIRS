import React from 'react';
import { RecordButtons } from './RecordToolbar';
import { ReviewToolbar } from './ReviewToolbar';

// Components
import Separator from '@components/Separator/Separator.component';
import IconButton from '@components/Buttons/IconButton.component';
import IconTextButton from '@components/Buttons/IconTextButton.component';
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
const IconTextButtonWithTooltip = withTooltip(IconTextButton);

type ReviewChartToolbarProps = {
  type: ChartType.RECORD | ChartType.REVIEW;
};
const ReviewChartToolbar = ({
  type = ChartType.RECORD,
}: ReviewChartToolbarProps) => {
  const recordState = useAppSelector((state: any) => state.recordState.value);
  const chartState = useAppSelector((state) => state.chartState) as any;
  const toolbarMenu = ReviewToolbar;
  const reviewChart = useChartContext().reviewChart;

  return (
    <>
      {reviewChart && (
        <ToolbarContainer>
          <div className="grid grid-flow-col col-span-4 auto-cols-max items-center gap-1">
            {toolbarMenu.map((option, index) => {
              if (option.label === 'separator')
                return <Separator orientation="vertical" key={index} />;
              return (
                <IconButtonWithTooltip
                  icon={option.icon}
                  isActive={chartState[option.label] || false}
                  onClick={() =>
                    option.click &&
                    option.click(reviewChart.chartOptions as ChartOptions)
                  }
                  tooltip={
                    option.tooltip === 'timeDivision' ? (
                      <TimeDivision
                        chartOptions={reviewChart.chartOptions as ChartOptions}
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
          <div className="grid grid-flow-col col-span-2 auto-cols-max items-center gap-3 justify-end">
            <div className="grid grid-flow-col auto-cols-max gap-3">
              {type === ChartType.RECORD
                ? RecordButtons.map((button, index) => (
                    <IconTextButtonWithTooltip
                      text={button.dynamicLabel(recordState)}
                      icon={button.dynamicIcon(recordState)}
                      darker
                      isActive={button.isActive(recordState)}
                      onClick={button.click(recordState)}
                      key={index}
                    />
                  ))
                : RecordButtons.map((button, index) => (
                    <IconTextButtonWithTooltip
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
        </ToolbarContainer>
      )}
    </>
  );
};

export default ReviewChartToolbar;
