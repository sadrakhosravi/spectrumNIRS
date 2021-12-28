import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';
import { useLocation } from 'react-router-dom';

//HOC
import withLoading from '@hoc/withLoading.hoc';

// Components
import RecordChartClass from './ChartClass/RecordChart';
import ChartToolbar from './ChartToolbar/ChartToolbar.component';

// Constants
import { ChartType } from 'utils/constants';
import ChartLayout, { ChartContainer } from './ChartContainer.component';

type ChartProps = {
  type: ChartType.RECORD | ChartType.REVIEW;
  setLoading: any;
  children: JSX.Element[];
};

// Prepares and enders the chart
const RecordChart = ({
  type,
  setLoading,
  children,
}: ChartProps): JSX.Element => {
  const [chartState, setChartState] = useState<null | RecordChartClass>(null);
  const [newData, setNewData] = useState(false);
  const location = useLocation();
  const sensorState = useAppSelector(
    (state) => state.sensorState.selectedSensor
  );
  const recordingId = useAppSelector(
    (state) => state.experimentData.currentRecording.id
  );
  const windowResized = useAppSelector((state) => state.appState.windowResized);
  const windowMaximized = useAppSelector(
    (state) => state.appState.windowMaximized
  );
  const recordSidebar = useAppSelector((state) => state.appState.recordSidebar);
  const channels = (sensorState && sensorState.defaultChannels) || [
    'No Channels',
  ];
  const samplingRate = (sensorState && sensorState.defaultSamplingRate) || 100;
  const containerId = 'recordChart';
  const chartRef = useRef<RecordChartClass | null>(null);

  let chart: RecordChartClass | undefined;

  // Create a new chart on component mount synchronously (needed for chart options to not throw an error)
  useEffect(() => {
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

        setChartState(chart);
        setLoading(false);
      }
    });

    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Destroy chart.
      window.api.removeListeners('data:reader-record');
      chart?.cleanup();
      console.log('destroy chart');
      chart = undefined;
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    setNewData(true);
    chartRef.current?.clearCharts();
  }, [recordingId]);

  console.log(newData);

  useEffect(() => {
    if (location.pathname === '/main/recording/record' && newData) {
      setTimeout(() => {
        console.log('Load Data Record Chart ');
        chartRef.current?.clearCharts();
        chartRef.current?.loadLatestData();
        setNewData(false);
      }, 100);
    }
  }, [newData, location]);

  const resetChartSize = () => {
    requestAnimationFrame(() => {
      const container = document.getElementById(containerId) as HTMLElement;
      const { offsetWidth, offsetHeight } = container;

      chartRef.current && chartRef.current?.dashboard?.setWidth(offsetWidth);
      chartRef.current && chartRef.current?.dashboard?.setHeight(offsetHeight);

      container.style.overflowX = 'hidden';
      container.style.overflowY = 'auto';
    });
  };

  // Adjust chart width and height on sidebar resize
  useEffect(() => {
    location.pathname === '/main/recording/record' && resetChartSize();
  }, [recordSidebar, windowResized, windowMaximized, location]);

  return (
    <ChartLayout>
      {chartState && (
        <ChartToolbar chartOptions={chartState.chartOptions} type={type} />
      )}
      <ChartContainer>
        <div className="overflow-y-auto h-full" id={containerId} />
        {children}
      </ChartContainer>
    </ChartLayout>
  );
};

export default withLoading(RecordChart, 'Loading Data ...');
