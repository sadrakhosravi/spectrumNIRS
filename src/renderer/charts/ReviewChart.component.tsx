import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// HOC
import withLoading from '@hoc/withLoading.hoc';

// Components
import ReviewChartClass from 'renderer/charts/ChartClass/ReviewChart';
import ChartToolbar from './ChartToolbar/ChartToolbar.component';

// Constants
import { ChartType } from 'utils/constants';
import ChartLayout, { ChartContainer } from './ChartContainer.component';

type ChartProps = {
  type: ChartType.RECORD | ChartType.REVIEW;
  recordState: any;
  setLoading?: any;
  children?: JSX.Element | JSX.Element[];
};

// Prepares and enders the chart
const ReviewChart = ({
  type,
  setLoading,
  children,
}: ChartProps): JSX.Element => {
  const [chartLoaded, setChartLoaded] = useState(false);
  const sensorState = useAppSelector(
    (state) => state.sensorState.selectedSensor
  );
  const currentTimeStamp = useAppSelector(
    (state) => state.chartState.currentEventTimeStamp
  );
  const reviewSidebar = useAppSelector((state) => state.appState.reviewSidebar);
  const windowResized = useAppSelector((state) => state.appState.windowResized);
  const windowMaximized = useAppSelector(
    (state) => state.appState.windowMaximized
  );
  const channels = (sensorState && sensorState.defaultChannels) || [
    'No Channels',
  ];
  const samplingRate = (sensorState && sensorState.defaultSamplingRate) || 100;

  const containerId = 'reviewChart';
  const chartRef = useRef<ReviewChartClass | null>(null);

  let chart: ReviewChartClass | undefined;

  useEffect(() => {
    requestAnimationFrame(() => {
      // Create chart, series and any other static components.
      console.log('create chart');
      // Store references to chart components.
      chart = new ReviewChartClass(
        channels || ['No Channels Found'],
        type,
        samplingRate,
        containerId
      );

      chart.createReviewChart();
      chart.loadInitialData();

      // Keep a ref to the chart
      chartRef.current = chart as any;

      setChartLoaded(true);
      setLoading(false);
    });
    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Destroy chart.
      console.log('destroy chart');
      chart?.cleanup();
      setChartLoaded(false);
      chart = undefined;
      chartRef.current = null;
    };
  }, []);

  const resetChartSize = () => {
    requestAnimationFrame(() => {
      const container = document.getElementById(containerId) as HTMLElement;
      const { offsetWidth, offsetHeight } = container;
      //@ts-ignore
      chartRef.current && chartRef.current.dashboard.setWidth(offsetWidth);
      chartRef.current && chartRef.current?.dashboard?.setHeight(offsetHeight);

      container.style.overflowX = 'hidden';
      container.style.overflowY = 'hidden';
    });
  };

  useEffect(() => {
    resetChartSize();
  }, [reviewSidebar, windowResized, windowMaximized]);

  useEffect(() => {
    chartRef.current?.setInterval(currentTimeStamp);
  }, [currentTimeStamp]);

  // useEffect(() => {
  //   recordState.id === -1 && chartRef.current?.clearCharts();
  //   recordState.id !== -1 &&
  //     setTimeout(() => {
  //       chartRef.current?.loadInitialData();
  //     }, 300);
  // }, [recordState]);

  return (
    <ChartLayout>
      {chartLoaded && chartRef.current?.chartOptions && (
        <ChartToolbar
          chartOptions={chartRef.current.chartOptions}
          type={type}
        />
      )}
      <ChartContainer>
        <div className="h-[2000px]" id={containerId} />
        {children}
      </ChartContainer>
    </ChartLayout>
  );
};

export default withLoading(ReviewChart, 'Loading Data...');
