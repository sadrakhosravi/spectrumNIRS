import React, { useEffect, useRef } from 'react';

// Components
import RecordChartClass from './ChartClass/RecordChart';

// Constants
import { ChartType } from 'utils/constants';
import ChartLayout, { ChartContainer } from './ChartContainer.component';
// import useContextMenu from '@hooks/useContextMenu';
// import ContextMenu from '@components/Menu/ContextMenu.component';
import { useChartContext } from 'renderer/context/ChartProvider';
import RecordChartToolbar from './Toolbar/RecordChartToolbar.component';
import { useAppSelector } from '@redux/hooks/hooks';
import { getState } from '@redux/store';

type ChartProps = {};

// Prepares and enders the chart
const RecordChart = ({}: ChartProps): JSX.Element => {
  const { setRecordChart } = useChartContext();

  const recordState = useAppSelector(
    (state) => state.global.recordState?.recordState
  );
  const recordingId = useAppSelector(
    (state) => state.global.recording?.currentRecording?.id
  );
  const currentProbeId = useAppSelector(
    (state) => state.global.probe?.currentProbe?.id
  );

  const chartRef = useRef<RecordChartClass | undefined>(undefined);
  const containerId = 'recordChart';

  // Create a new chart on component mount synchronously (needed for chart options to not throw an error)
  useEffect(() => {
    let chart: RecordChartClass | undefined;
    if (chart) return;

    // Create chart, series and any other static components.
    chart = new RecordChartClass(containerId, ChartType.RECORD);

    chart.createRecordChart();

    // Keep a ref to the chart
    chartRef.current = chart as RecordChartClass;
    setRecordChart(chart);

    const recordState = getState().global.recordState?.recordState;
    const recordSettings = getState().global.recording?.currentRecording;
    console.log(recordSettings);
    if (recordState !== 'continue' && recordState !== 'recording') {
      chart.loadInitialData();
    } else {
      chart.stopChartLoading();
    }

    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Destroy chart.
      chart?.stopListeningForData();
      chart?.cleanup();
      chartRef.current = undefined;
      setRecordChart(undefined);
    };
  }, [recordingId, currentProbeId]);

  useEffect(() => {
    if (recordState === 'recording' || recordState === 'continue') {
      chartRef.current?.listenForData();
    } else {
      chartRef.current?.stopListeningForData();
    }
  }, [recordState]);

  return (
    <ChartLayout>
      <RecordChartToolbar type={ChartType.RECORD} />
      <ChartContainer type={ChartType.RECORD}>
        <div
          className="pointer-events-auto h-full w-full"
          id={containerId}
        ></div>
      </ChartContainer>
    </ChartLayout>
  );
};

export default RecordChart;
