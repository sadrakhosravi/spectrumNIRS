import React from 'react';
import { useAppDispatch } from '@redux/hooks/hooks';
import {
  ChartPositions,
  resetMaximizedChannel,
  setReviewChartMaximizedChannel,
} from '@redux/ReviewChartSlice';

// Components
import SignalLabelAndSettings from './SignalLabelAndSettings.component';

// Icons
import EnlargeIcon from '@icons/enlarge.svg';
import ReviewChart from '../ReviewChart';
import RecordChart from '../RecordChart';

type ChannelUIProps = {
  chart: ReviewChart | RecordChart | undefined;
  chartPos: ChartPositions;
  name: string;
  color: string;
  index: number;
  isMaximized?: boolean;
};

const ChannelUI = ({
  chart,
  chartPos,
  name,
  color,
  index,
  isMaximized = false,
}: ChannelUIProps) => {
  const dispatch = useAppDispatch();
  const handleMaximizeChannel = () => {
    if (isMaximized) {
      dispatch(resetMaximizedChannel());
      chart?.chartOptions?.resetChartsHeight();
      return;
    }
    for (let i = 0; i < 10; i++) {
      chart?.dashboard.setRowHeight(i, 0);
    }
    chart?.dashboard.setRowHeight(0, 0.07);
    chart?.dashboard.setRowHeight(index + 1, 1);
    dispatch(setReviewChartMaximizedChannel(name));
  };

  return (
    <>
      {chartPos.height && chartPos.height > 10 && (
        <>
          <div
            className="fixed bg-dark2 border-b-[3px] border-r-[3px] border-[#222] p-2 flex"
            style={{
              top: chartPos.y + 'px',
              left: chartPos.x - 100 + 'px',
              height: chartPos.height + 'px',
              width: '100px',
            }}
          >
            <SignalLabelAndSettings
              name={name}
              color={color}
              chartPos={chartPos}
            />

            {chartPos.height > 80 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 max-h-8">
                <button
                  className={`w-8 h-8 p-1 flex items-center rounded-md ${
                    isMaximized ? 'opacity-100 bg-accent' : 'opacity-40 bg-dark'
                  }`}
                  onClick={() => handleMaximizeChannel()}
                  title="Make this channel fullscreen"
                >
                  <img
                    className={`w-full h-full`}
                    src={EnlargeIcon}
                    alt="Expand"
                  />
                </button>
              </div>
            )}
          </div>
          <div
            className="fixed flex items-center justify-center -rotate-90 z-10"
            style={{
              top: chartPos.y + 'px',
              left: chartPos.x + 'px',
              height: chartPos.height + 'px',
              width: '25px',
            }}
          >
            mV
          </div>
        </>
      )}
    </>
  );
};
export default ChannelUI;
