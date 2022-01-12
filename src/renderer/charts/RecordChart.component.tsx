import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// Components
import RecordChartClass from './ChartClass/RecordChart';

// Constants
import { ChartType } from 'utils/constants';
import ChartLayout, { ChartContainer } from './ChartContainer.component';
import useContextMenu from '@hooks/useContextMenu';
import ContextMenu from '@components/Menu/ContextMenu.component';
import { useChartContext } from 'renderer/context/ChartProvider';
import RecordChartToolbar from './Toolbar/RecordChartToolbar.component';

type ChartProps = {};

// Prepares and enders the chart
const RecordChart = ({}: ChartProps): JSX.Element => {
  const [newData, setNewData] = useState(false);
  const { setRecordChart } = useChartContext();
  const recordingId = useAppSelector(
    (state) => state.experimentData.currentRecording.id
  );
  const recordSidebar = useAppSelector((state) => state.appState.recordSidebar);
  const recordingState = useAppSelector((state) => state.recordState.value);

  const chartRef = useRef<RecordChartClass | undefined>(undefined);
  const containerId = 'recordChart';

  // Create a new chart on component mount synchronously (needed for chart options to not throw an error)
  useEffect(() => {
    setTimeout(() => {
      // Create chart, series and any other static components.
      const chart = new RecordChartClass(containerId, ChartType.RECORD);

      chart.createRecordChart();
      // Attach event listeners
      chart.listenForData();

      // Keep a ref to the chart
      chartRef.current = chart as RecordChartClass;
      setRecordChart(chart);
    }, 100);

    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Destroy chart.
      window.api.removeListeners('data:reader-record');
      setRecordChart(undefined);
      chartRef.current?.cleanup();
      console.log('destroy chart');
      chartRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    setNewData(true);
    chartRef.current?.clearData();
  }, [recordingId]);

  useEffect(() => {
    if (newData) {
      setTimeout(() => {
        chartRef.current?.clearCharts();
        chartRef.current?.loadLatestData();
        setNewData(false);
      }, 100);
    }
  }, [newData]);

  const resetChartSize = () => {
    requestAnimationFrame(() => {
      chartRef.current?.dashboard.engine.layout();
    });
  };

  // Adjust chart width and height on sidebar resize
  useEffect(() => {
    location.pathname === '/main/recording/record' && resetChartSize();
    requestAnimationFrame(() => chartRef.current?.sendChartPositions());
  }, [recordSidebar]);

  useEffect(() => {}, [recordingState]);

  useContextMenu(
    containerId,
    <ContextMenu
      items={[
        { label: 'Auto Scale', value: 'test' },
        { label: 'separator', value: '' },
        { label: 'Channel Settings', value: '' },
        { label: 'separator', value: '' },
        {
          label: 'Maximize Channel',
          value: '',
        },
        { label: 'Reset Channel Heights', value: '' },
      ]}
    />
  );

  return (
    <ChartLayout>
      <RecordChartToolbar type={ChartType.RECORD} />
      <ChartContainer type={ChartType.RECORD}>
        <div
          className="h-full w-full pointer-events-auto"
          id={containerId}
        ></div>
      </ChartContainer>
    </ChartLayout>
  );
};

export default RecordChart;
