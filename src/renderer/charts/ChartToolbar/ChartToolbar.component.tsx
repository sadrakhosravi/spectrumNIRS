import React from 'react';
import { RecordToolbar, RecordButtons } from './RecordToolbar';
import { ReviewToolbar } from './ReviewToolbar';

// Components
import Separator from '@components/Separator/Separator.component';
import IconButton from '@components/Buttons/IconButton.component';
import IconTextButton from '@components/Buttons/IconTextButton.component';
import withTooltip from '@hoc/withTooltip.hoc';
import TimeDivision from './TimeDivision.component';

// Constants
import { ChartType } from '@utils/constants';
import { useAppSelector } from '@redux/hooks/hooks';

// Buttons with tooltip
const IconButtonWithTooltip = withTooltip(IconButton);
const IconTextButtonWithTooltip = withTooltip(IconTextButton);

type ChartToolbarProps = {
  chartOptions: any;
  type?: ChartType | undefined;
};
const ChartToolbar = ({
  chartOptions,
  type = ChartType.RECORD,
}: ChartToolbarProps) => {
  const recordState = useAppSelector((state: any) => state.recordState.value);
  const chartState = useAppSelector((state) => state.chartState) as any;
  const toolbarMenu = type === ChartType.RECORD ? RecordToolbar : ReviewToolbar;

  return (
    <div className="w-full bg-grey1 px-2 max-h-[50px] h-[50px] grid gap-3 grid-flow-col grid-cols-6 items-center relative">
      <div className="grid grid-flow-col col-span-4 auto-cols-max items-center gap-1">
        {toolbarMenu.map((option, index) => {
          if (option.label === 'separator') return <Separator key={index} />;
          return (
            <IconButtonWithTooltip
              icon={option.icon}
              isActive={chartState[option.label] || false}
              onClick={() => option.click && option.click(chartOptions)}
              tooltip={
                option.tooltip === 'timeDivision' ? (
                  <TimeDivision chartOptions={chartOptions} />
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
      </div>

      {/* Stop Start Button */}
      <div className="grid grid-flow-col col-span-2 auto-cols-max items-center gap-3 justify-end">
        <div className="grid grid-flow-col auto-cols-max gap-3">
          {type === ChartType.RECORD &&
            RecordButtons.map((button, index) => (
              <IconTextButtonWithTooltip
                text={button.dynamicLabel(recordState)}
                icon={button.dynamicIcon(recordState)}
                darker
                isActive={button.isActive(recordState)}
                onClick={button.click(recordState)}
                key={index}
              />
            ))}
          {type === ChartType.REVIEW &&
            RecordButtons.map((button, index) => (
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
    </div>
  );
};

export default React.memo(ChartToolbar);
