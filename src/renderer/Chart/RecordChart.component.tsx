import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@redux/hooks/hooks';
import { changeRecordState } from '@redux/RecordStateSlice';

//HOC
import withLoading from '@hoc/withLoading.hoc';

// Components
import LCJSChart from 'renderer/Chart/ChartClass/Chart';
import ChartToolbar from './ChartToolbar/ChartToolbar.component';

// Constants
import { ChartType, RecordState } from 'utils/constants';
import { ChartChannels } from '@utils/channels';
import { setPreviousData } from '@redux/ExperimentDataSlice';

type ChartProps = {
  type: ChartType.RECORD | ChartType.REVIEW;
  recordChartLoaded: boolean;
  recordState: any;
  setLoading: any;
  children: JSX.Element[];
};

// Prepares and enders the chart
const RecordChart = ({
  type,
  recordChartLoaded,
  setLoading,
  recordState,
  children,
}: ChartProps): JSX.Element => {
  const [chartLoaded, setChartLoaded] = useState(false);
  const [chartState, setChartState] = useState<null | LCJSChart>(null);
  const dispatch = useAppDispatch();
  const sensorState = useAppSelector(
    (state) => state.sensorState.selectedSensor
  );
  const recordSidebar = useAppSelector((state) => state.appState.recordSidebar);
  const channels = (sensorState && sensorState.channels) || ['No Channels'];
  const samplingRate = (sensorState && sensorState.samplingRate) || 100;

  const containerId = 'recordChart';
  const chartRef = useRef<LCJSChart | null>(null);

  let chart: LCJSChart | undefined;

  console.log(chartLoaded);

  // Create a new chart on component mount synchronously (needed for chart options to not throw an error)
  useEffect(() => {
    requestAnimationFrame(() => {
      if (!chart) {
        console.log('RECORD CHARTTT');

        // Create chart, series and any other static components.
        console.log('create chart');
        // Store references to chart components.
        chart = new LCJSChart(
          channels || ['No Channels Found'],
          type,
          samplingRate,
          containerId
        );

        chart.createChart();

        // Attach event listeners
        chart.recordData();

        // Keep a ref to the chart
        chartRef.current = chart as LCJSChart;

        setChartLoaded(true);
        setChartState(chart);
      }
    });

    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Destroy chart.
      dispatch(changeRecordState(RecordState.IDLE));
      chart?.cleanup();
      window.api.removeListeners('data:reader-record');
      console.log('destroy chart');
      setChartLoaded(false);
      chart = undefined;
      chartRef.current = null;
    };
  }, [recordChartLoaded]);

  useEffect(() => {
    chartRef.current?.clearCharts();
  }, [recordState]);

  // Check if the current recording has data
  useEffect(() => {
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
                  chartRef.current.series.forEach((series: any, i: number) => {
                    series.add({ x: sensorData[0], y: sensorData[i + 1] });
                  });
              }, 100);
            });
          });

        const lastTimeStamp = data[data.length - 1].values.split(',')[0];
        dispatch(
          setPreviousData({
            timeStamp: parseFloat(lastTimeStamp),
            hasPreviousData: true,
          })
        );
      }
    });
    requestAnimationFrame(() => setLoading(false));
  }, [recordState.id]);

  // Adjust chart width and height on sidebar resize
  useEffect(() => {
    requestAnimationFrame(() => {
      const container = document.getElementById(containerId) as HTMLElement;
      const { offsetWidth, offsetHeight } = container;

      chartRef.current && chartRef.current.dashboard.setWidth(offsetWidth);
      chartRef.current && chartRef.current.dashboard.setHeight(offsetHeight);

      container.style.overflowX = 'hidden';
      container.style.overflowY = 'hidden';
    });
  }, [recordSidebar]);

  return (
    <>
      {chartLoaded && chartState && (
        <ChartToolbar chartOptions={chartState.ChartOptions} type={type} />
      )}

      <div
        hidden={false}
        className="absolute top-0 left-0 h-[calc(100%-50px)]"
        id={containerId}
      />
      {children}
    </>
  );
};

export default withLoading(RecordChart, 'Loading Data ...');
