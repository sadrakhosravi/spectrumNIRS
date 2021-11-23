import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// HOC
import withLoading from '@hoc/withLoading.hoc';

// Components
import LCJSChart from 'renderer/Chart/ChartClass/Chart';
import ChartToolbar from './ChartToolbar/ChartToolbar.component';

// Constants
import { ChartType } from 'utils/constants';
import { ChartChannels } from '@utils/channels';

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
  const reviewSidebar = useAppSelector((state) => state.appState.reviewSidebar);
  const sensorState = useAppSelector(
    (state) => state.sensorState.selectedSensor
  );
  const recordState = useAppSelector(
    (state) => state.experimentData.currentRecording
  );
  const isReviewInNewTab = useAppSelector(
    (state) => state.appState.reviewTabInNewWindow
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
  }, [recordState.id, isReviewInNewTab]);

  // Check if the current recording has data
  useEffect(() => {
    setLoading(true);

    (async () => {
      const data: any[] = await window.api.invokeIPC(
        ChartChannels.CheckForData,
        recordState.id
      );

      // If the recording has data, display it and save the last timestamp
      if (data.length !== 0) {
        data &&
          data.reverse().forEach((dataPoint: any) => {
            const data = dataPoint.values.split(',');
            const sensorData = [
              parseFloat(data[0]),
              parseFloat(data[1]),
              parseFloat(data[2]),
              parseFloat(data[3]),
              parseFloat(data[4]),
            ];
            requestAnimationFrame(() => {
              setTimeout(() => {
                chartRef.current &&
                  chartRef.current.series.forEach((series: any, i: number) => {
                    series.add({ x: sensorData[0], y: sensorData[i + 1] });
                  });
              }, 100);
            });
          });
      }
      requestAnimationFrame(() => setLoading(false));
    })();
  }, [recordState.id]);

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
      {children}
    </>
  );
};

export default withLoading(ReviewChart, 'Loading Data...');
