import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// Components
import LCJSChart from 'renderer/Chart/ChartClass/Chart';
import ChartToolbar from './ChartToolbar/GraphToolbar.component';

// Constants
import { ChartType } from 'utils/constants';

type ChartProps = {
  type: ChartType.RECORD | ChartType.REVIEW;
};

// Prepares and enders the chart
const ReviewChart = ({ type }: ChartProps): JSX.Element => {
  const [chartLoaded, setChartLoaded] = useState(false);
  const reviewSidebar = useAppSelector((state) => state.appState.reviewSidebar);
  const sensorState = useAppSelector(
    (state) => state.sensorState.selectedSensor
  );
  const channels = (sensorState && sensorState.channels) || ['No Channels'];
  const samplingRate = (sensorState && sensorState.samplingRate) || 100;

  const containerId = 'reviewChart';
  const chartRef = useRef<LCJSChart | null>(null);

  console.log(channels);

  useEffect(() => {
    let reviewChart: LCJSChart | undefined;

    // Create chart, series and any other static components.
    console.log('create chart');
    // Store references to chart components.
    reviewChart = new LCJSChart(
      channels || ['No Channels Found'],
      type,
      samplingRate,
      containerId
    );

    reviewChart.createChart();

    // Keep a ref to the chart
    chartRef.current = reviewChart as any;

    setChartLoaded(true);

    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Destroy chart.
      reviewChart?.cleanup();
      window.api.removeListeners('data:reader-record');
      console.log('destroy chart');
      setChartLoaded(false);
      reviewChart = undefined;

      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      const container = document.getElementById(containerId) as HTMLElement;
      const { offsetWidth } = container;
      //@ts-ignore
      chartRef.current && chartRef.current.dashboard.setWidth(offsetWidth);
      container.style.overflowX = 'hidden';
    });
  }, [reviewSidebar]);

  return (
    <>
      {chartLoaded && chartRef.current?.ChartOptions && (
        <ChartToolbar
          chartOptions={chartRef.current.ChartOptions}
          type={type}
        />
      )}

      <div
        key={containerId}
        className="absolute top-0 left-0 w-full h-[calc(100%-50px)]"
        id={containerId}
      />
    </>
  );
};

export default ReviewChart;
