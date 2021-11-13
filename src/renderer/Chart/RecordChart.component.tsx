import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@redux/hooks/hooks';
import { changeRecordState } from '@redux/RecordStateSlice';
// Components
import LCJSChart from 'renderer/Chart/ChartClass/Chart';
import ChartToolbar from './ChartToolbar/GraphToolbar.component';

// Constants
import { ChartType, RecordState } from 'utils/constants';

type ChartProps = {
  type: ChartType.RECORD | ChartType.REVIEW;
};

// Prepares and enders the chart
const RecordChart = ({ type }: ChartProps): JSX.Element => {
  const [chartLoaded, setChartLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const recordingName = useAppSelector(
    (state) => state.experimentData.currentRecording.name
  );
  const sensorState = useAppSelector(
    (state) => state.sensorState.selectedSensor
  );
  const recordSidebar = useAppSelector((state) => state.appState.recordSidebar);
  const channels = (sensorState && sensorState.channels) || ['No Channels'];
  const samplingRate = (sensorState && sensorState.samplingRate) || 100;

  const containerId = 'recordChart';
  const chartRef = useRef<LCJSChart | null>(null);

  useEffect(() => {
    let chart: LCJSChart | undefined;
    console.log('RECORD CHARTTT');

    // Create chart, series and any other static components.
    console.log('create chart');
    // Store references to chart components.
    chart = new LCJSChart(
      channels || ['No Channels Found'],
      type,
      samplingRate,
      containerId
    );

    chart.createChart();

    // Attach event listeners
    chart.recordData();

    // Keep a ref to the chart
    chartRef.current = chart as LCJSChart;

    setChartLoaded(true);

    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Destroy chart.
      dispatch(changeRecordState(RecordState.IDLE));
      chart?.cleanup();
      window.api.removeListeners('data:reader-record');
      console.log('destroy chart');
      setChartLoaded(false);
      chart = undefined;

      chartRef.current = null;
    };
  }, [recordingName]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const container = document.getElementById(containerId) as HTMLElement;
      const { offsetWidth } = container;
      //@ts-ignore
      chartRef.current && chartRef.current.dashboard.setWidth(offsetWidth);
      container.style.overflowX = 'hidden';
    });
  }, [recordSidebar]);

  return (
    <>
      {chartLoaded && <ChartToolbar chart={chartRef.current} type={type} />}

      <div
        hidden={false}
        className="absolute top-0 left-0 h-[calc(100%-50px)]"
        id={containerId}
      />
    </>
  );
};

export default RecordChart;
