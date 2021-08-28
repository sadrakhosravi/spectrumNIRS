import React, { useEffect, useRef } from 'react';
import ChartClass from '@chart/ChartClass/ChartClass';
import ChartChannelTitle from '@chart/ChartChannelTitle/ChartChannelTitle.component';

const { ipcRenderer } = window.require('electron');

//Prepares and enders the chart
const Chart = () => {
  useEffect(() => {
    const chart = new ChartClass();
    chart.createDashboard();

    ipcRenderer.on('record', () => {
      if (chart.dashboard) {
        chart.dashboard.dispose();
        chart.createDashboard();
      }
    });
    ipcRenderer.on('testdata', (event, data) => {
      chart.ChartSeries.forEach(series => series.add({ x: data.TimeStamp / 1000, y: data.Probe0.O2Hb }));
    });
    return () => {
      // Destroy chart.
      console.log('destroy chart');
      chart.dashboard.dispose();
    };
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
