import React, { useEffect } from 'react';
import ChartClass from '@chart/ChartClass/ChartClass';
import ChartChannelTitle from '@chart/ChartChannelTitle/ChartChannelTitle.component';

//Prepares and enders the chart
const Chart = () => {
  useEffect(() => {
    const chart = new ChartClass();
  }, []);

  return (
    <div className="fit-to-container grid grid-cols-12">
      <div className="h-full col-span-1 grid grid-rows-4 grid-flow-row">
        <ChartChannelTitle text="O2Hb" color="chart1" />
        <ChartChannelTitle text="HHb" color="chart2" />
        <ChartChannelTitle text="tHb" color="chart3" />
        <ChartChannelTitle text="TOI" color="chart4" isLast={true} />
      </div>
      <div className="h-full col-span-11" id="chart"></div>
    </div>
  );
};

export default Chart;
