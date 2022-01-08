import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';
import { useLocation } from 'react-router-dom';

//HOC
import withLoading from '@hoc/withLoading.hoc';

// Components
import RecordChartClass from './ChartClass/RecordChart';

// Constants
import { ChartType } from 'utils/constants';
import ChartLayout, { ChartContainer } from './ChartContainer.component';
import useContextMenu from '@hooks/useContextMenu';
import ContextMenu from '@components/Menu/ContextMenu.component';
import { getState } from '@redux/store';

type ChartProps = {
  type: ChartType.RECORD | ChartType.REVIEW;
  setLoading: any;
  children: JSX.Element[];
};

// Prepares and enders the chart
const RecordChart = ({
  type,
  setLoading,
  children,
}: ChartProps): JSX.Element => {
  const [chartState, setChartState] = useState<null | RecordChartClass>(null);
  const [newData, setNewData] = useState(false);
  const location = useLocation();
  const currentProbe = useAppSelector(
    (state) => state.sensorState.currentProbe
  );
  const recordingId = useAppSelector(
    (state) => state.experimentData.currentRecording.id
  );
  const recordSidebar = useAppSelector((state) => state.appState.recordSidebar);
  const recordingState = useAppSelector((state) => state.recordState.value);

  const samplingRate = (currentProbe && currentProbe.samplingRate) || 100;
  const containerId = 'recordChart';
  const chartRef = useRef<RecordChartClass | null>(null);

  let chart: RecordChartClass | undefined;

  // Create a new chart on component mount synchronously (needed for chart options to not throw an error)
  useEffect(() => {
    requestAnimationFrame(() => {
      const channels =
        getState().sensorState.currentProbe?.device.defaultChannels;
      if (!chart) {
        console.log('RECORD CHARTTT');

        // Create chart, series and any other static components.
        console.log('create chart');
        // Store references to chart components.
        chart = new RecordChartClass(
          channels || ['No Channels Found'],
          type,
          samplingRate,
          containerId
        );

        chart.createRecordChart();

        // Attach event listeners
        chart.listenForData();

        // Keep a ref to the chart
        chartRef.current = chart as RecordChartClass;

        setChartState(chart);
        setLoading(false);
      }
    });

    // Return function that will destroy the chart when component is unmounted.
    return () => {
      // Destroy chart.
      window.api.removeListeners('data:reader-record');
      chart?.cleanup();
      console.log('destroy chart');
      chart = undefined;
      chartRef.current = null;
    };
  }, [currentProbe?.id]);

  useEffect(() => {
    setNewData(true);
    chartRef.current?.clearData();
  }, [recordingId]);

  console.log(newData);

  useEffect(() => {
    if (location.pathname === '/main/recording/record' && newData) {
      setTimeout(() => {
        console.log('Load Data Record Chart ');
        chartRef.current?.clearCharts();
        chartRef.current?.loadLatestData();
        setNewData(false);
      }, 100);
    }
  }, [newData, location]);

  const resetChartSize = () => {
    requestAnimationFrame(() => {
      chartRef.current?.dashboard.engine.layout();
    });
  };

  // Adjust chart width and height on sidebar resize
  useEffect(() => {
    location.pathname === '/main/recording/record' &&
      setTimeout(() => {
        resetChartSize();
      }, 1);
  }, [recordSidebar, location]);

  useEffect(() => {
    console.log('recordState Change');
  }, [recordingState]);

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
      {chartState && null}
      <ChartContainer>
        <div className="h-full w-full pointer-events-auto" id={containerId}>
          {children}
        </div>
      </ChartContainer>
    </ChartLayout>
  );
};

export default withLoading(RecordChart, 'Loading Data ...');
