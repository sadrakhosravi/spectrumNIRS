import { lightningChart, AxisScrollStrategies, emptyFill, Themes } from '@arction/lcjs';
import React, { useRef, useEffect } from 'react';

const { ipcRenderer } = window.require('electron');

const Chart1 = props => {
  const { data, id } = props;
  const chartRef = useRef(undefined);

  useEffect(() => {
    // Create chart, series and any other static components.
    // NOTE: console log is used to make sure that chart is only created once, even if data is changed!
    console.log('create chart');
    const channels = ['Ch 1', 'Ch 2', 'Ch 3', 'Ch 4', 'Ch 5'];
    const channelCount = channels.length;

    // Create Dashboard.
    const grid = lightningChart().Dashboard({
      // theme: Themes.darkGold
      numberOfRows: channelCount,
      numberOfColumns: 1,
      container: test,
    });

    // Map XY-charts to Dashboard for each channel.
    const charts = channels.map((channelName, i) => {
      const chart = grid
        .createChartXY({
          columnIndex: 0,
          rowIndex: i,
          columnSpan: 1,
          rowSpan: 1,
        })
        // Hide titles because we have very little space.
        .setTitleFillStyle(emptyFill);

      // Configure X-axis of chart to be progressive and have nice interval.
      chart.getDefaultAxisX().setScrollStrategy(AxisScrollStrategies.progressive).setInterval(0, 10000); // 10,000 millisecond axis

      return chart;
    });

    // Map progressive line series for each chart.
    const series = charts.map((chart, i) =>
      chart
        .addLineSeries({
          dataPattern: {
            // pattern: 'ProgressiveX' => Each consecutive data point has increased X coordinate.
            pattern: 'ProgressiveX',
            // regularProgressiveStep: true => The X step between each consecutive data point is regular (for example, always `1.0`).
            regularProgressiveStep: true,
          },
        })
        // Destroy automatically outscrolled data (old data becoming out of X axis range).
        // Actual data cleaning can happen at any convenient time (not necessarily immediately when data goes out of range).
        .setMaxPointCount(2000)
        .setStrokeStyle(lineStyle => lineStyle.setThickness(1.0)),
    );
    // Store references to chart components.
    chartRef.current = { grid, series };

    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Destroy chart.
      console.log('destroy chart');
      grid.dispose();
      chartRef.current = undefined;
    };
  }, [id]);

  useEffect(() => {
    const components = chartRef.current;
    if (!components) return;

    // Set chart data.
    const { series } = components;
    console.log('set chart data', data);

    ipcRenderer.on('testdata', (event, data) => {
      series.forEach(series1 => {
        series1.add({ x: data.TimeStamp / 1000, y: data.Probe0.O2Hb });
      });
    });
  }, [data, chartRef]);

  return <div id="test" className="fit-to-container"></div>;
};

export default Chart1;
