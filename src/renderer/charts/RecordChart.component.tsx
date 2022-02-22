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
import { useAppSelector } from '@redux/hooks/hooks';

type ChartProps = {};

// Prepares and enders the chart
const RecordChart = ({}: ChartProps): JSX.Element => {
  const [_newData, _setNewData] = useState(false);
  const { setRecordChart } = useChartContext();

  const recordState = useAppSelector(
    (state) => state.global.recordState?.recordState
  );

  const chartRef = useRef<RecordChartClass | undefined>(undefined);
  const containerId = 'recordChart';

  // Create a new chart on component mount synchronously (needed for chart options to not throw an error)
  useEffect(() => {
    // Create chart, series and any other static components.
    const chart = new RecordChartClass(containerId, ChartType.RECORD);

    chart.createRecordChart();
    // Attach event listeners

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

  useEffect(() => {
    recordState === 'recording'
      ? chartRef.current?.listenForData()
      : chartRef.current?.stopListeningForData();
  }, [recordState]);

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
