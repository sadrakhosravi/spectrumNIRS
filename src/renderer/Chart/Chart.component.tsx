import React, { useEffect, useRef, useState } from 'react';

// Components
import LCJSChart from 'renderer/Chart/ChartClass/Chart';
import ChartToolbar from './ChartToolbar/GraphToolbar.component';

// Constants
import { ChartType, RecordState } from 'utils/constants';
import { useAppSelector } from '@redux/hooks/hooks';

// State

interface IProps {
  type: ChartType.RECORD | ChartType.REVIEW;
}

declare const window: any;

// Prepares and enders the chart
const Chart: React.FC<IProps> = ({ type }) => {
  const [chartLoaded, setChartLoaded] = useState(false);
  const recordState = useAppSelector((state) => state.recordState.value);
  const sensorState = useAppSelector(
    (state) => state.sensorState.detectedSensor
  );
  const recordSidebar = useAppSelector((state) => state.appState.recordSidebar);
  const channels = (sensorState && sensorState.channels) || ['No Channels'];
  const samplingRate = (sensorState && sensorState.samplingRate) || 100;

  const containerID = 'chart';
  const chartRef = useRef(undefined);

  useEffect(() => {
    let chart: LCJSChart;

    requestAnimationFrame(() => {
      // Create chart, series and any other static components.
      console.log('create chart');
      // Store references to chart components.
      chart = new LCJSChart(
        channels || ['No Channels Found'],
        type,
        samplingRate
      );

      // Attach event listeners
      type === ChartType.RECORD && chart.recordData();

      // Keep a ref to the chart
      chartRef.current = chart as any;

      sensorState && setChartLoaded(true);
      !sensorState && setChartLoaded(false);
    });

    // Return function that will destroy the chart when component is unmounted.
    return () => {
      requestAnimationFrame(() => {
        // Destroy chart.
        console.log('destroy chart');
        chart.cleanup();

        delete window.chart;
        delete window.ChartClass;

        chartRef.current = undefined;
      });
    };
  }, [sensorState]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const container = document.getElementById(containerID) as HTMLElement;
      const { offsetWidth } = container;
      //@ts-ignore
      chartRef.current && chartRef.current.dashboard.setWidth(offsetWidth);
      container.style.overflowX = 'hidden';
    });
  }, [recordSidebar]);

  // Clear series if recording has restarted
  useEffect(() => {
    if (recordState === RecordState.RECORD) {
      const chart: any = chartRef.current;

      // Clear all series
      chart.series.forEach((series: any) => {
        series.clear();
      });
    }
  }, [recordState]);

  // If its the review tab
  if (type === ChartType.REVIEW) {
    const handleKeyDown = async (event: any) => {
      const chart: any = chartRef.current;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const currentInterval = chart.charts[0].getDefaultAxisX().getInterval();
        const test = await window.api.getRecordingOnKeyDown(currentInterval);
        chart.reviewData(test);

        console.log(test);
        console.log(currentInterval);
      }
    };

    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, []);
  }

  return (
    <>
      {chartLoaded && <ChartToolbar chart={chartRef.current} type={type} />}

      <div className="h-[calc(100%-50px)]" id={containerID} />
    </>
  );
};

export default Chart;
