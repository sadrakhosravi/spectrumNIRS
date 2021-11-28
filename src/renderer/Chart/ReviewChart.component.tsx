import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// HOC
import withLoading from '@hoc/withLoading.hoc';

// Components
import ReviewChartClass from 'renderer/Chart/ChartClass/ReviewChart';
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

  recordState,
  setLoading,
  children,
}: ChartProps): JSX.Element => {
  const [chartLoaded, setChartLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  // const reviewSidebar = useAppSelector((state) => state.appState.reviewSidebar);
  const sensorState = useAppSelector(
    (state) => state.sensorState.selectedSensor
  );

  const location = useLocation();

  const channels = (sensorState && sensorState.channels) || ['No Channels'];
  const samplingRate = (sensorState && sensorState.samplingRate) || 100;

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

      // Keep a ref to the chart
      chartRef.current = chart as any;

      setChartLoaded(true);
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
              const sensorData = [
                dataPoint.timeStamp,
                dataPoint.O2Hb,
                dataPoint.HHb,
                dataPoint.THb,
                dataPoint.TOI,
              ];
              requestAnimationFrame(() => {
                setTimeout(() => {
                  chartRef.current &&
                    chartRef.current?.series?.forEach(
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
  }, [location]);

  useEffect(() => {
    setDataLoaded(false);
  }, [recordState.id]);

  // useEffect(() => {
  //   requestAnimationFrame(() => {
  //     const container = document.getElementById(containerId) as HTMLElement;
  //     const { offsetWidth } = container;
  //     //@ts-ignore
  //     chartRef.current && chartRef.current.dashboard.setWidth(offsetWidth);
  //     container.style.overflowX = 'hidden';
  //   });
  // }, [reviewSidebar]);

  return (
    <>
      {chartLoaded && chartRef.current?.chartOptions && (
        <ChartToolbar
          chartOptions={chartRef.current.chartOptions}
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
