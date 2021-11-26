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
import { useLocation } from 'react-router';

type ChartProps = {
  type: ChartType.RECORD | ChartType.REVIEW;
  reviewChartLoaded: any;
  recordState: any;
  setLoading?: any;
  children?: JSX.Element | JSX.Element[];
};

// Prepares and enders the chart
const ReviewChart = ({
  type,
  reviewChartLoaded,
  recordState,
  setLoading,
  children,
}: ChartProps): JSX.Element => {
  const [chartLoaded, setChartLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const reviewSidebar = useAppSelector((state) => state.appState.reviewSidebar);
  const sensorState = useAppSelector(
    (state) => state.sensorState.selectedSensor
  );

  const isReviewInNewTab = useAppSelector(
    (state) => state.appState.reviewTabInNewWindow
  );
  const location = useLocation();

  const channels = (sensorState && sensorState.channels) || ['No Channels'];
  const samplingRate = (sensorState && sensorState.samplingRate) || 100;

  const containerId = 'reviewChart';
  const chartRef = useRef<LCJSChart | null>(null);

  let reviewChart: LCJSChart | undefined;

  useEffect(() => {
    requestAnimationFrame(() => {
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
    });
    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Destroy chart.
      reviewChart?.cleanup();
      console.log('destroy chart');
      setChartLoaded(false);
      reviewChart = undefined;
      chartRef.current = null;
    };
  }, [isReviewInNewTab, reviewChartLoaded]);

  // Check if the current recording has data
  useEffect(() => {
    if (location.pathname.includes('review') && dataLoaded === false) {
      setLoading(true);

      requestAnimationFrame(async () => {
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
                    chartRef.current.series.forEach(
                      (series: any, i: number) => {
                        series.add({ x: sensorData[0], y: sensorData[i + 1] });
                      }
                    );
                }, 100);
              });
            });
        }
      });
    }
    setDataLoaded(true);
    requestAnimationFrame(() => setLoading(false));
  }, [recordState.id, location]);

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
