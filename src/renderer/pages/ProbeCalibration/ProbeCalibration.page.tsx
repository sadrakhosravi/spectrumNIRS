import React, { useEffect, useState } from 'react';
import { signalQualityMonitor } from '@adapters/recordAdapter';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';

// Chart
import Page from '@components/Page/Page.component';
import ProbeCalibrationChart from 'renderer/charts/ChartClass/ProbeCalibrationChart';

// Constants
import { SidebarType } from '@utils/constants';
import IconTextButton from '@components/Buttons/IconTextButton.component';

// Icons
import StartIcon from '@icons/start.svg';
import PauseIcon from '@icons/pause.svg';

import { RecordChannels } from '@utils/channels';
import { setProbeCalibrationSidebar } from '@redux/AppStateSlice';
import ToolbarContainer from '@components/Toolbar/ToolbarContainer.component';

const ProbeCalibrationPage = () => {
  const [isQualityChecking, setIsQualityChecking] = useState(false);
  const containerId = 'probeCalibrationChart';
  const sidebarState = useAppSelector(
    (state) => state.appState.probeCalibrationSidebar
  );
  const dispatch = useAppDispatch();
  let chart: ProbeCalibrationChart | undefined;
  useEffect(() => {
    chart = new ProbeCalibrationChart(containerId);
    chart.createSignalMonitorChart();

    return () => {
      window.api.sendIPC(RecordChannels.Stop);
      chart?.cleanup();
    };
  }, []);

  const handleStartMonitoring = async () => {
    const isStarted = await signalQualityMonitor(!isQualityChecking);
    isStarted && chart?.resetData();
    isStarted && setIsQualityChecking(!isQualityChecking);
  };

  return (
    <Page
      sidebarType={SidebarType.PROBE_CALIBRATION}
      sidebarState={sidebarState}
      onSidebarClick={() => dispatch(setProbeCalibrationSidebar(!sidebarState))}
    >
      <ToolbarContainer>
        <div className="col-start-5 col-span-2 items-center text-center">
          {isQualityChecking && (
            <p className="w-full text-sm">Refresh Rate: 0.5s</p>
          )}
          <div className="w-28 ml-auto">
            <IconTextButton
              icon={isQualityChecking ? PauseIcon : StartIcon}
              text={isQualityChecking ? 'Stop' : 'Start'}
              onClick={() => {
                handleStartMonitoring();
              }}
              isActive={isQualityChecking}
            />
          </div>
        </div>
      </ToolbarContainer>

      <div className="w-full h-[calc(100%-50px)]" id={containerId}></div>
    </Page>
  );
};
export default ProbeCalibrationPage;
