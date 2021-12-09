import React, { useEffect, useState } from 'react';
import { signalQualityMonitor } from '@adapters/recordAdapter';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';
import { setRecordSidebar } from '@redux/AppStateSlice';
import WidgetsContainer from '@chart/Widgets/WidgetsContainer.component';

// Chart
import SignalQualityMonitor from '@chart/ChartClass/SignalQualityMonitorChart';

// Constants
import { ChartType } from '@utils/constants';
import IconTextButton from '@components/Buttons/IconTextButton.component';

// Icons
import StartIcon from '@icons/start.svg';
import PauseIcon from '@icons/pause.svg';
import { RecordChannels } from '@utils/channels';

const SignalQualityMonitorPage = () => {
  const [isQualityChecking, setIsQualityChecking] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  const containerId = 'signalQualityMonitorChart';
  const isSidebarActive = useAppSelector(
    (state) => state.appState.recordSidebar
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const chart = new SignalQualityMonitor(containerId);
    chart.createSignalMonitorChart();

    return () => {
      window.api.sendIPC(RecordChannels.Stop);
      chart.cleanup();
    };
  }, []);

  useEffect(() => {
    !isFirstTime && signalQualityMonitor(isQualityChecking);
    isFirstTime && setIsFirstTime(false);
  }, [isQualityChecking]);

  return (
    <div className="h-full">
      <div className={`absolute top-0 left-0 h-full w-full flex`}>
        <div
          id={containerId}
          className={`h-full relative ${
            isSidebarActive
              ? 'w-[calc(100%-350px)] mr-[15px]'
              : 'w-[calc(100%-20px)]'
          }`}
        >
          <div className="absolute top-2 right-7 z-30 flex items-center gap-4">
            {isQualityChecking && (
              <p className="w-full text-sm">Refresh Rate: 0.5s</p>
            )}
            <span className="w-28">
              <IconTextButton
                icon={isQualityChecking ? PauseIcon : StartIcon}
                text={isQualityChecking ? 'Stop' : 'Start'}
                onClick={() => {
                  setIsQualityChecking(!isQualityChecking);
                }}
                isActive={isQualityChecking}
              />
            </span>
          </div>
        </div>
        <div
          className={`h-full mt-6 ${
            isSidebarActive
              ? 'w-[325px]'
              : 'w-[20px] bg-grey1 hover:bg-accent hover:cursor-pointer'
          }`}
          onClick={() => !isSidebarActive && dispatch(setRecordSidebar(true))}
        >
          <WidgetsContainer type={ChartType.RECORD} />
        </div>
      </div>
    </div>
  );
};
export default SignalQualityMonitorPage;
