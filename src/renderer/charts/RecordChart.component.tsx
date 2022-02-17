import React, { useEffect, useRef, useState } from 'react';
// import { useAppSelector } from '@redux/hooks/hooks';

// Components
import RecordChartClass from './ChartClass/RecordChart';

// Constants
import { ChartType } from 'utils/constants';
import ChartLayout, { ChartContainer } from './ChartContainer.component';
// import useContextMenu from '@hooks/useContextMenu';
// import ContextMenu from '@components/Menu/ContextMenu.component';
import { useChartContext } from 'renderer/context/ChartProvider';
import RecordChartToolbar from './Toolbar/RecordChartToolbar.component';

type ChartProps = {};

// Prepares and enders the chart
const RecordChart = ({}: ChartProps): JSX.Element => {
  const [_newData, _setNewData] = useState(false);
  const { setRecordChart } = useChartContext();
  // const recordingId = useAppSelector(
  //   (state) => state.experimentData.currentRecording.id
  // );
  // const recordSidebar = useAppSelector((state) => state.appState.recordSidebar);

  const chartRef = useRef<RecordChartClass | undefined>(undefined);
  const containerId = 'recordChart';

  // Create a new chart on component mount synchronously (needed for chart options to not throw an error)
  useEffect(() => {
    // Create chart, series and any other static components.
    const chart = new RecordChartClass(containerId, ChartType.RECORD);

    chart.createRecordChart();
    // Attach event listeners
    // chart.listenForData();

    // Keep a ref to the chart
    chartRef.current = chart as RecordChartClass;
    setRecordChart(chart);

    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Destroy chart.
      console.log('destroy chart');
      window.api.removeListeners('data:reader-record');
      chartRef.current = undefined;
      setRecordChart(undefined);
      chart.cleanup();
    };
  }, []);

  // useEffect(() => {
  //   setNewData(true);
  //   chartRef.current?.clearData();

  //   return () => (chartRef.current = undefined);
  // }, [recordingId]);

  // useEffect(() => {
  //   if (newData) {
  //     setTimeout(() => {
  //       chartRef.current?.clearCharts();
  //       // chartRef.current?.loadLatestData();
  //       setNewData(false);
  //     }, 100);
  //   }

  //   return () => (chartRef.current = undefined);
  // }, [newData]);

  // // Adjust chart width and height on sidebar resize
  // useEffect(() => {
  //   chartRef.current?.sendChartPositions();
  //   chartRef.current?.dashboard.engine.layout();

  //   return () => (chartRef.current = undefined);
  // }, [recordSidebar]);

  // useContextMenu(
  //   containerId,
  //   <ContextMenu
  //     items={[
  //       { label: 'Auto Scale', value: 'test' },
  //       { label: 'separator', value: '' },
  //       { label: 'Channel Settings', value: '' },
  //       { label: 'separator', value: '' },
  //       {
  //         label: 'Maximize Channel',
  //         value: '',
  //       },
  //       { label: 'Reset Channel Heights', value: '' },
  //     ]}
  //   />
  // );

  return (
    <ChartLayout>
      <RecordChartToolbar type={ChartType.RECORD} />
      <ChartContainer type={ChartType.RECORD}>
        <div
          className="pointer-events-auto h-full w-full"
          id={containerId}
        ></div>
      </ChartContainer>
    </ChartLayout>
  );
};

export default RecordChart;
