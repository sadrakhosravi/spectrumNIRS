import React, { useEffect, useRef } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// Components
import ReviewChartClass from 'renderer/charts/ChartClass/ReviewChart';

// Constants
import { ChartType } from 'utils/constants';
import ChartLayout, { ChartContainer } from './ChartContainer.component';
import { useChartContext } from 'renderer/context/ChartProvider';
import ReviewChartToolbar from './Toolbar/ReviewChartToolbar.component';

type ChartProps = {
  children?: JSX.Element | JSX.Element[];
};

// Prepares and enders the chart
const ReviewChart = ({ children }: ChartProps): JSX.Element => {
  const { setReviewChart } = useChartContext();

  const currentProbe = useAppSelector(
    (state) => state.global.probe?.currentProbe
  );
  const recordingId = useAppSelector(
    (state) => state.global.recording?.currentRecording?.id
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
        samplingRate,
        containerId
      );

      chart.createReviewChart();
      setReviewChart(chart);
      requestAnimationFrame(() => chart?.loadInitialData());

      // Keep a ref to the chart
      chartRef.current = chart as any;
    });
    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Remove references to the review chart in the state
      setReviewChart(undefined);

      // Destroy chart.
      console.log('destroy chart');
      chartRef.current?.cleanup();
      chartRef.current = undefined;
    };
  }, [recordingId]);

  const resetChartSize = () => {
    requestAnimationFrame(() => {
      chartRef.current?.dashboard.engine.layout();
    });
    return () => (chartRef.current = undefined);
  };

  useEffect(() => {
    resetChartSize();
  }, [reviewSidebar, windowResized, windowMaximized]);

  return (
    <ChartLayout>
      <ReviewChartToolbar type={ChartType.REVIEW} />

      <ChartContainer type={ChartType.REVIEW}>
        <div className="pointer-events-auto h-full" id={containerId} />
        {children}
      </ChartContainer>
    </ChartLayout>
  );
};

export default ReviewChart;
