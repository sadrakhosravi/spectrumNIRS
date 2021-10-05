import React, { useEffect, useRef } from 'react';

// Components
import ChartChannelTitle from '@chart/ChartChannelTitle/ChartChannelTitle.component';
import LCJSChart from '@chart/ChartClass/Chart';

// Constants
import { ChartType } from '@constants/Constants';

// State
import { useSelector } from 'react-redux';

interface IProps {
  type: ChartType.RECORD | ChartType.REVIEW;
}

declare const window: any;

// Prepares and enders the chart
const Chart: React.FC<IProps> = ({ type }) => {
  const recordState = useSelector((state: any) => state.recordState.value);
  const containerID = 'chart';
  const chartRef = useRef(undefined);

  useEffect(() => {
    // Create chart, series and any other static components.
    console.log('create chart');
    const channels = ['O2Hb', 'HHb', 'THb', 'TOI'];
    // Store references to chart components.
    const chart: any = new LCJSChart(channels, type);

    // Attach event listeners
    type === ChartType.RECORD && chart.recordData();

    // Keep a ref to the chart
    chartRef.current = chart;

    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Destroy chart.
      console.log('destroy chart');
      chart.cleanup();

      delete window.chart;
      delete window.ChartClass;

      chartRef.current = undefined;
    };
  }, []);

  // Clear series if recording has restarted
  useEffect(() => {
    if (recordState === 'recording') {
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
    <div className="fit-to-container grid grid-cols-12">
      <div className="h-full col-span-1 grid grid-rows-4 grid-flow-row">
        <ChartChannelTitle text="O2Hb" color="chart1" />
        <ChartChannelTitle text="HHb" color="chart2" />
        <ChartChannelTitle text="tHb" color="chart3" />
        <ChartChannelTitle text="TOI" color="chart4" isLast />
      </div>
      <div className="h-full col-span-11" id={containerID} />
    </div>
  );
};

export default Chart;
