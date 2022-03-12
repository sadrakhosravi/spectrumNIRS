import React, { useEffect, useRef, useState } from 'react';
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
import { dispatch, getState } from '@redux/store';
import { useAppSelector } from '@redux/hooks/hooks';

// Mp3
import TOINotification from '../../../../sound/TOI_notification.mp3';

type ChannelUIProps = {
  chart: ReviewChart | RecordChart | undefined;
  chartPos: ChartPositions;
  name: string;
  color: string;
  index: number;
  isMaximized?: boolean;
};

const TOIChannel = ({
  chart,
  chartPos,
  name,
  color,
  index,
  isMaximized = false,
}: ChannelUIProps) => {
  const [TOIWarning, setTOIWarning] = useState(false);

  const recordState = useAppSelector(
    (state) => state.global.recordState?.recordState
  );

  const TOIValRef = useRef<HTMLDivElement | null>(null);
  const TOIThreshold =
    getState().global.recording?.currentRecording?.settings.TOIThreshold;

  useEffect(() => {
    const TOINotif = new Audio(TOINotification);
    const handleTOIValue = (TOI: number) => {
      if (TOIThreshold?.threshold) {
        // Check for minimum and maximum
        if (TOI < TOIThreshold.minimum || TOI > TOIThreshold.maximum) {
          setTOIWarning(true);
          TOINotif.play();
        } else {
          setTOIWarning(false);
          TOINotif.pause();
        }
      }
    };

    // Add TOI value event listener
    window.api.onIPCData('device:TOI', (_event, TOI: number) => {
      if (!TOIValRef.current) return;
      //TOI Warning
      handleTOIValue(TOI);

      //@ts-ignore
      TOIValRef.current.innerText = Math.round(TOI);
    });

    return () => window.api.removeListeners('device:TOI');
  }, []);

  useEffect(() => {
    //@ts-ignore
    if (TOIValRef.current) TOIValRef.current.innerText = '';
  }, [recordState]);

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
      {chartPos?.height && chartPos.height > 10 && (
        <>
          <div
            className={`fixed z-40 flex border-b-[3px] border-r-[3px] border-[#222] bg-dark2 p-2 ${
              TOIWarning && 'animate-pulse-fast bg-red/30'
            }`}
            style={{
              top: chartPos.y + 'px',
              left: chartPos.x - 130 + 'px',
              height: chartPos.height + 'px',
              width: '130px',
            }}
          >
            <div className="relative h-full w-full">
              <SignalLabelAndSettings
                chart={chart}
                name={name}
                color={color}
                chartPos={chartPos}
              />

              {chartPos.height > 120 && (
                <div
                  className={`absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-medium ${
                    TOIWarning && 'animate-pulse-fast text-red'
                  }`}
                  ref={TOIValRef}
                ></div>
              )}

              {chartPos.height > 80 && (
                <div className="absolute bottom-2 left-1/2 flex max-h-8 -translate-x-1/2 items-center gap-1.5">
                  <button
                    className={`flex h-8 w-8 items-center rounded-md p-1 ${
                      isMaximized
                        ? 'bg-accent opacity-100'
                        : 'bg-dark opacity-40'
                    }`}
                    onClick={() => handleMaximizeChannel()}
                    title="Make this channel fullscreen"
                  >
                    <img
                      className={`h-full w-full`}
                      src={EnlargeIcon}
                      alt="Expand"
                    />
                  </button>
                </div>
              )}
            </div>
            <div
              className="fixed z-10 flex items-center justify-center"
              style={{
                top: chartPos.y + 'px',
                left: chartPos.x + 'px',
                height: chartPos.height + 'px',
                width: '15px',
              }}
            >
              <p
                className="w-[10px] -rotate-90 text-xs"
                hidden={chartPos.height <= 40}
              >
                Units
              </p>
            </div>
          </div>
          {TOIWarning &&
            (recordState === 'recording' || recordState === 'continue') && (
              <div
                className="fixed z-30 flex animate-pulse-fast items-center justify-center bg-red/30"
                style={{
                  top: chartPos.y + 'px',
                  left: chartPos.x + 'px',
                  height: chartPos.height + 'px',
                  width: chartPos.width + 'px',
                }}
              />
            )}
        </>
      )}
    </>
  );
};
export default TOIChannel;
