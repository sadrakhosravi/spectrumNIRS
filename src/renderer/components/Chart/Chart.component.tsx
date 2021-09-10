import React, { useEffect, useRef } from 'react';

// Components
import ChartChannelTitle from '@chart/ChartChannelTitle/ChartChannelTitle.component';
import ChartClass from '@chart/ChartClass/ChartClass';

// State
import { useSelector } from 'react-redux';

declare const window: any;

// Prepares and enders the chart
const Chart = () => {
  const recordState = useSelector((state: any) => state.recordState.value);
  const containerID = 'chart';

  const chartRef = useRef(undefined);

  useEffect(() => {
    // Create chart, series and any other static components.
    console.log('create chart');

    // Store references to chart components.
    const chart: any = new ChartClass();
    chart.addNIRSData();

    chartRef.current = chart;

    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Destroy chart.
      console.log('destroy chart');
      chart.cleanup();

      delete window.chart;
      delete window.ChartClass;

      // chartRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (recordState === 'recording') {
      const chart: any = chartRef.current;

      chart.Series.forEach((series: any) => {
        series.clear();
      });
    }
  }, [recordState]);

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