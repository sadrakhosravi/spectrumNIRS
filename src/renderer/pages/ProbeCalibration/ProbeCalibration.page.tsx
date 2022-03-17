import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';

// Chart
import Page from '@components/Page/Page.component';
import ProbeCalibrationChart from 'renderer/charts/ChartClass/ProbeCalibrationChart';

// Constants
import { SidebarType } from '@utils/constants';
import ActionButton from '@components/Buttons/ActionButton.component';

// Icons
import StartIcon from '@icons/start.svg';
import PauseIcon from '@icons/pause.svg';

import { RecordChannels } from '@utils/channels';
import { setProbeCalibrationSidebar } from '@redux/AppStateSlice';
import ToolbarContainer from '@components/Toolbar/ToolbarContainer.component';

const ProbeCalibrationPage = () => {
  const containerId = 'probeCalibrationChart';
  const dispatch = useAppDispatch();
  const [isDisabled, setIsDisabled] = useState(false);

  const chartRef = useRef<ProbeCalibrationChart | undefined>(undefined);

  const sidebarState = useAppSelector(
    (state) => state.appState.probeCalibrationSidebar
  );
  const isCalibrating = useAppSelector(
    (state) => state.global.recordState?.isCalibrating
  );

  useEffect(() => {
    const chart = new ProbeCalibrationChart(containerId);
    chart.createProbeCalibrationChart();

    chartRef.current = chart;

    return () => {
      window.api.invokeIPC(RecordChannels.ProbeCalibration, true);
      chartRef.current = undefined;
      chart?.cleanup();
    };
  }, []);

  useEffect(() => {
    if (isCalibrating) {
      chartRef.current?.listenForData();
    } else {
      chartRef.current?.stopListening();
      setTimeout(() => chartRef.current?.resetData(), 1000);
    }
  }, [isCalibrating]);

  const handleDeviceCalibration = async () => {
    !isDisabled &&
      (await window.api.invokeIPC(
        RecordChannels.ProbeCalibration,
        isCalibrating
      ));
    setIsDisabled(true);
    setTimeout(() => setIsDisabled(false), 800);
  };

  return (
    <Page
      sidebarType={SidebarType.PROBE_CALIBRATION}
      sidebarState={sidebarState}
      onSidebarClick={() => dispatch(setProbeCalibrationSidebar(!sidebarState))}
    >
      <ToolbarContainer>
        <div className="flex w-full items-center justify-end">
          {isCalibrating && (
            <p className="ml-auto mr-4 inline-block text-sm">
              Refresh Rate: 0.1s
            </p>
          )}
          <div className="mr-4 inline-block">
            <ActionButton
              icon={isCalibrating ? PauseIcon : StartIcon}
              text={isCalibrating ? 'Stop' : 'Start'}
              onClick={() => handleDeviceCalibration()}
              isActive={isCalibrating}
              disabled={isDisabled}
            />
          </div>
        </div>
      </ToolbarContainer>

      <div className="h-[calc(100%-50px)] w-full" id={containerId}></div>
    </Page>
  );
};
export default ProbeCalibrationPage;
