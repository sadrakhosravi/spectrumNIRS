import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@redux/hooks/hooks';
import { changeRecordState } from '@redux/RecordStateSlice';
import { useLocation } from 'react-router';

//HOC
import withLoading from '@hoc/withLoading.hoc';

// Components
import RecordChartClass from './ChartClass/RecordChart';
import ChartToolbar from './ChartToolbar/ChartToolbar.component';

// Constants
import { ChartType, RecordState } from 'utils/constants';

type ChartProps = {
  type: ChartType.RECORD | ChartType.REVIEW;
  recordChartLoaded: boolean;
  setLoading: any;
  children: JSX.Element[];
};

// Prepares and enders the chart
const RecordChart = ({
  type,
  recordChartLoaded,
  setLoading,
  children,
}: ChartProps): JSX.Element => {
  const [chartLoaded, setChartLoaded] = useState(false);
  const [chartState, setChartState] = useState<null | RecordChartClass>(null);
  const [newData, setNewData] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const sensorState = useAppSelector(
    (state) => state.sensorState.selectedSensor
  );
  const recordingId = useAppSelector(
    (state) => state.experimentData.currentRecording.id
  );
  const windowResized = useAppSelector((state) => state.appState.windowResized);
  const recordSidebar = useAppSelector((state) => state.appState.recordSidebar);
  const channels = (sensorState && sensorState.channels) || ['No Channels'];
  const samplingRate = (sensorState && sensorState.samplingRate) || 100;
  const containerId = 'recordChart';
  const chartRef = useRef<RecordChartClass | null>(null);

  let chart: RecordChartClass | undefined;

  // Create a new chart on component mount synchronously (needed for chart options to not throw an error)
  useEffect(() => {
    if (location.pathname === '/main/recording/record' && !chartLoaded) {
      requestAnimationFrame(() => {
        if (!chart) {
          console.log('RECORD CHARTTT');

          // Create chart, series and any other static components.
          console.log('create chart');
          // Store references to chart components.
          chart = new RecordChartClass(
            channels || ['No Channels Found'],
            type,
            samplingRate,
            containerId
          );

          chart.createRecordChart();

          // Attach event listeners
          chart.listenForData();

          // Keep a ref to the chart
          chartRef.current = chart as RecordChartClass;

          setChartLoaded(true);
          setChartState(chart);
          setLoading(false);
        }
      });
    }

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
  }, [recordChartLoaded]);

  useEffect(() => {
    setNewData(true);
    chartRef.current?.clearCharts();
  }, [recordingId]);

  useEffect(() => {
    if (location.pathname === '/main/recording/record' && newData) {
      chartRef.current?.clearCharts();
      chartRef.current?.loadLatestData();
      setNewData(false);
    }
  }, [newData, location]);

  // Adjust chart width and height on sidebar resize
  useEffect(() => {
    requestAnimationFrame(() => {
      const container = document.getElementById(containerId) as HTMLElement;
      const { offsetWidth, offsetHeight } = container;

      chartRef.current && chartRef.current?.dashboard?.setWidth(offsetWidth);
      chartRef.current && chartRef.current?.dashboard?.setHeight(offsetHeight);

      container.style.overflowX = 'hidden';
      container.style.overflowY = 'hidden';
    });
  }, [recordSidebar, windowResized]);

  return (
    <>
      {chartLoaded && chartState && (
        <ChartToolbar chartOptions={chartState.chartOptions} type={type} />
      )}

      <div
        hidden={false}
        className="absolute top-0 left-0 h-[calc(100%-50px)]"
        id={containerId}
      />
      {children}
    </>
  );
};

export default withLoading(RecordChart, 'Loading Data ...');
