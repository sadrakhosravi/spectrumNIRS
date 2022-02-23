import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// HOC
import withLoading from '@hoc/withLoading.hoc';

// Components
import ReviewChartClass from 'renderer/charts/ChartClass/ReviewChart';

// Constants
import { ChartType } from 'utils/constants';
import ChartLayout, { ChartContainer } from './ChartContainer.component';
import { useChartContext } from 'renderer/context/ChartProvider';
import ReviewChartToolbar from './Toolbar/ReviewChartToolbar.component';

type ChartProps = {
  type: ChartType.RECORD | ChartType.REVIEW;
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
  const [isNewData, setIsNewData] = useState(false);
  const { setReviewChart } = useChartContext();

  const currentProbe = useAppSelector(
    (state) => state.sensorState.currentProbe
  );
  const recordState = useAppSelector(
    (state) => state.experimentData.currentRecording
  );
  const currentTimeStamp = useAppSelector(
    (state) => state.chartState.currentEventTimeStamp
  );
  const reviewSidebar = useAppSelector((state) => state.appState.reviewSidebar);
  const windowResized = useAppSelector((state) => state.appState.windowResized);
  const windowMaximized = useAppSelector(
    (state) => state.appState.windowMaximized
  );
  const channels = (currentProbe && currentProbe.device.defaultChannels) || [
    'No Channels',
  ];
  const samplingRate = (currentProbe && currentProbe.samplingRate) || 100;

  const containerId = 'reviewChart';
  let chartRef = useRef<ReviewChartClass | undefined>(undefined);

  useEffect(() => {
    requestAnimationFrame(() => {
      // Create chart, series and any other static components.
      console.log('create chart');
      // Store references to chart components.
      const chart = new ReviewChartClass(
        channels || ['No Channels Found'],
        type,
        samplingRate,
        containerId
      );

      setReviewChart(chart);
      chart.createReviewChart();
      requestAnimationFrame(() => chart?.loadInitialData());

      // Keep a ref to the chart
      chartRef.current = chart as any;

      setChartLoaded(true);
      setLoading(false);
    });
    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Remove references to the review chart in the state
      setReviewChart(undefined);

      // Destroy chart.
      console.log('destroy chart');
      chartRef.current?.cleanup();
      chartRef.current = undefined;
      setChartLoaded(false);
    };
  }, []);

  const resetChartSize = () => {
    requestAnimationFrame(() => {
      chartRef.current?.dashboard.engine.layout();
    });
    return () => (chartRef.current = undefined);
  };

  useEffect(() => {
    resetChartSize();
  }, [reviewSidebar, windowResized, windowMaximized]);

  useEffect(() => {
    chartRef.current?.setInterval(currentTimeStamp);

    return () => (chartRef.current = undefined);
  }, [currentTimeStamp]);

  useEffect(() => {
    !isNewData && setIsNewData(true);
  }, [recordState]);

  useEffect(() => {}, [isNewData]);

  return (
    <ChartLayout>
      {chartLoaded && <ReviewChartToolbar type={type} />}

      <ChartContainer type={ChartType.REVIEW}>
        <div className="pointer-events-auto h-full" id={containerId} />
        {children}
      </ChartContainer>
    </ChartLayout>
  );
};

export default withLoading(ReviewChart, 'Loading Engine...');
