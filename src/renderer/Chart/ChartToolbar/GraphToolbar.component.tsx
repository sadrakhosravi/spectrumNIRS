import React, { useLayoutEffect, useRef } from 'react';
import { RecordToolbar, RecordButtons } from './RecordToolbar';
import { ReviewToolbar } from './ReviewToolbar';

import ChartOptions from '../ChartClass/ChartOptions';

// Components
import Separator from '@components/Separator/Separator.component';
import IconButton from '@components/Buttons/IconButton.component';
import IconTextButton from '@components/Buttons/IconTextButton.component';
import withTooltip from '@hoc/withTooltip.hoc';

// Constants
import { ChartType } from '@utils/constants';
import { useAppSelector } from '@redux/hooks/hooks';

// Buttons with tooltip
const IconButtonWithTooltip = withTooltip(IconButton);
const IconTextButtonWithTooltip = withTooltip(IconTextButton);

type ChartToolbarProps = {
  chart: any;
  type?: ChartType | undefined;
};
const ChartToolbar = ({
  chart,
  type = ChartType.RECORD,
}: ChartToolbarProps) => {
  const recordState = useAppSelector((state: any) => state.recordState.value);
  const chartState = useAppSelector((state) => state.chartState) as any;
  const toolbarMenu = type === ChartType.RECORD ? RecordToolbar : ReviewToolbar;
  const chartOptionsRef = useRef<ChartOptions>();

  let chartOptions: ChartOptions | undefined;

  useLayoutEffect(() => {
    chartOptions = new ChartOptions(
      chart.channels,
      chart.dashboard,
      chart.charts,
      chart.series
    );
    chartOptionsRef.current = chartOptions;

    return () => {
      chartOptions = undefined;
      chartOptionsRef.current = undefined;
    };
  }, [chart]);

  return (
    <div className="w-full bg-grey1 px-2 max-h-[50px] h-[50px] grid gap-3 grid-flow-col grid-cols-2 items-center relative">
      <div className="grid grid-flow-col auto-cols-max items-center gap-1">
        {toolbarMenu.map((option, index) => {
          if (option.label === 'separator') return <Separator key={index} />;
          return (
            <IconButtonWithTooltip
              icon={option.icon}
              isActive={chartState[option.label] || false}
              onClick={() =>
                //@ts-ignore
                option.click && option.click(chartOptionsRef.current)
              }
              tooltip={option.tooltip}
              key={index}
            />
          );
        })}
      </div>

      {/* Stop Start Button */}
      <div className="grid grid-flow-col auto-cols-max items-center gap-3 justify-end">
        <div className="grid grid-flow-col auto-cols-max gap-3">
          {RecordButtons.map((button, index) => (
            <IconTextButtonWithTooltip
              text={button.dynamicLabel(recordState)}
              icon={button.dynamicIcon(recordState)}
              darker
              isActive={button.isActive(recordState)}
              onClick={button.click(recordState)}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartToolbar;
