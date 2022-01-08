import React from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

import ReviewChart from '../ReviewChart';
import RecordChart from '../RecordChart';
import ChannelUI from './ChannelUI.component';

type ChannelUIProps = {
  chart: ReviewChart | RecordChart | undefined;
};

const Channels = ({ chart }: ChannelUIProps) => {
  const chartPos = useAppSelector(
    (state) => state.reviewChartState.chartPositions
  );
  const currentProbe = useAppSelector(
    (state) => state.sensorState.currentProbe
  );
  const maximizedChannel = useAppSelector(
    (state) => state.reviewChartState.maximizedChannel
  );
  console.log(maximizedChannel);

  return (
    <div className="w-full h-full bg-dark2 relative">
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
          />
        ))}
    </div>
  );
};
export default Channels;
