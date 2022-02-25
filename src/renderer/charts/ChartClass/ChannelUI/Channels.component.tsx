import React from 'react';
import { getState } from '@redux/store';
import { useAppSelector } from '@redux/hooks/hooks';
import { useChartContext } from 'renderer/context/ChartProvider';

import ChannelUI from './ChannelUI.component';

// Constants
import { ChartType } from '@utils/constants';
import TOIChannel from './TOI.componen';
import { shallowEqual } from 'react-redux';

type ChannelUIProps = {
  type: ChartType;
};

const Channels = ({ type }: ChannelUIProps) => {
  const chartPos = useAppSelector((state) =>
    type === ChartType.RECORD
      ? state.recordChartState.chartPositions
      : state.reviewChartState.chartPositions
  );
  const currentProbe = getState().global.probe?.currentProbe;

  const maximizedChannel = useAppSelector(
    (state) => state.reviewChartState.maximizedChannel,
    shallowEqual
  );
  const chart =
    useChartContext()[
      `${type === ChartType.RECORD ? 'recordChart' : 'reviewChart'}`
    ];

  return (
    <div className="relative h-full w-full bg-dark2">
      {chartPos &&
        currentProbe?.device.defaultChannels.map((channel, i) =>
          channel !== 'TOI' ? (
            <ChannelUI
              chart={chart}
              chartPos={chartPos[i]}
              name={channel}
              color={currentProbe.device.defaultColors[i]}
              isMaximized={maximizedChannel === channel}
              index={i}
              key={channel + 'channelUI'}
            />
          ) : (
            <TOIChannel
              chart={chart}
              chartPos={chartPos[i]}
              name={channel}
              color={currentProbe.device.defaultColors[i]}
              isMaximized={maximizedChannel === channel}
              index={i}
              key={channel + 'channelUI'}
            />
          )
        )}
    </div>
  );
};
export default Channels;
