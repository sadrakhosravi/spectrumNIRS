import React from 'react';
import { useAppSelector } from '@redux/hooks/hooks';
import { useChartContext } from 'renderer/context/ChartProvider';

import ChannelUI from './ChannelUI.component';

// Constants
import { ChartType } from '@utils/constants';

type ChannelUIProps = {
  type: ChartType;
};

const Channels = ({ type }: ChannelUIProps) => {
  const chartPos = useAppSelector((state) =>
    type === ChartType.RECORD
      ? state.recordChartState.chartPositions
      : state.reviewChartState.chartPositions
  );
  const currentProbe = useAppSelector(
    (state) => state.sensorState.currentProbe
  );
  const maximizedChannel = useAppSelector(
    (state) => state.reviewChartState.maximizedChannel
  );
  const chart =
    type === ChartType.RECORD
      ? useChartContext().recordChart
      : useChartContext().reviewChart;

  const TOI = useAppSelector((state) => state.recordChartState.TOI);

  return (
    <div className="relative h-full w-full bg-dark2">
      {chartPos &&
        currentProbe?.device.defaultChannels.map((channel, i) => (
          <ChannelUI
            chart={chart}
            chartPos={chartPos[i]}
            name={channel}
            color={currentProbe.device.defaultColors[i]}
            isMaximized={maximizedChannel === channel}
            index={i}
            key={channel + 'channelUI'}
            reading={
              (type === ChartType.RECORD && channel === 'TOI' && TOI) ||
              undefined
            }
          />
        ))}
    </div>
  );
};
export default Channels;
