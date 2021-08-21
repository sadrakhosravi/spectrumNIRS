import React, { useEffect } from 'react';
import ChartClass from '@chart/ChartClass';

// Extract required parts from LightningChartJS.

//Prepares and enders the chart
const Chart = () => {
  // const { lightningChart } = lcjs;

  // const channels = ['Ch 1', 'Ch 2', 'Ch 3', 'Ch 4'];
  // const channelCount = channels.length;

  //For the div to load first so that Lightning chart can find the id.
  useEffect(() => {
    const chart = new ChartClass();
  }, []);
  return <div className="fit-to-container" id="chart"></div>;
};

export default Chart;
