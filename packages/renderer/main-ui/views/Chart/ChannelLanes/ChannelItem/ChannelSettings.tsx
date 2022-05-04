import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from './channelSettings.module.scss';

// Components
import { Popover } from '/@/components/Elements/Popover/Popover';
import { Separator } from '/@/components/Elements/Separator';
import { Row, Column } from '/@/components/Elements/Grid';

// Types
import type { IChart } from '@viewmodels/Chart/ChartViewModel';

type ChannelSettingsType = {
  chart: IChart;
  parentRef: HTMLButtonElement;
  closeSetter: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ChannelSettings = observer(
  ({ parentRef, chart, closeSetter }: ChannelSettingsType) => {
    const yMinId = React.useId();
    const yMaxId = React.useId();
    const gainId = React.useId();

    const [seriesInfo, setSeriesInfo] = React.useState({ name: '', color: '#fff', gainVal: 1 });
    const [chartInfo, setChartInfo] = React.useState({ yMin: -50, yMax: 50 });
    const [intervalUpdate, setIntervalUpdate] = React.useState(false); // Used to signal interval update.

    // Series useEffect
    React.useEffect(() => {
      if (chart && chart.series.length !== 0) {
        const color = chart.series[0].color as string;
        const name = chart.series[0].series.getName() as string;
        const gainVal = chart.series[0].gainVal as number;

        setSeriesInfo({ name, color, gainVal });
      }
    }, [chart.series[0].gainVal, chart.series[0].color]);

    // Chart useEffect
    React.useEffect(() => {
      if (chart && chart.series.length !== 0) {
        const interval = chart.dashboardChart.chart.getDefaultAxisY().getInterval();
        const yMin = interval.start;
        const yMax = interval.end;

        setChartInfo({ yMin, yMax });
      }
    }, [intervalUpdate]);

    // Handle gain value change
    const handleGainValueChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (isNaN(value)) return;

      chart.series[0].setSeriesGain(value);
    }, []);

    const handleYMinIntervalChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (isNaN(value)) return;
        const currentInterval = chart.dashboardChart.chart.getDefaultAxisY().getInterval();

        chart.dashboardChart.chart.getDefaultAxisY().setInterval(value, currentInterval.end);
        setIntervalUpdate(!intervalUpdate);
      },
      [intervalUpdate],
    );

    const handleYMaxIntervalChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (isNaN(value)) return;
        const currentInterval = chart.dashboardChart.chart.getDefaultAxisY().getInterval();

        chart.dashboardChart.chart.getDefaultAxisY().setInterval(currentInterval.start, value);
        setIntervalUpdate(!intervalUpdate);
      },
      [intervalUpdate],
    );

    return (
      <>
        <Popover buttonRef={parentRef} title="Signal" closeSetter={closeSetter}>
          {/* Channel Info */}
          <div className={styles.ChannelInfo}>
            <span style={{ backgroundColor: seriesInfo.color }} />
            <input type="text" value={seriesInfo.name} disabled />
          </div>

          <Separator gap="0.5rem" />

          {/* Chart Settings */}
          <span>Chart Settings:</span>
          <Row className={styles.ChartSettings} gap="2rem" marginBottom="2rem">
            <Column width="50%">
              {/* Y Min */}
              <Row>
                <Column width="25%">
                  <label htmlFor={yMinId}>Y Min:</label>
                </Column>
                <Column width="75%">
                  <input
                    id={yMinId}
                    tabIndex={1}
                    type={'number'}
                    value={chartInfo.yMin}
                    onChange={handleYMinIntervalChange}
                  />
                </Column>
              </Row>
            </Column>
            {/* Y Max */}
            <Column width="50%">
              <Row>
                <Column width="25%">
                  <label htmlFor={yMaxId}>Y Max:</label>
                </Column>
                <Column width="75%">
                  <input
                    id={yMaxId}
                    tabIndex={2}
                    type={'number'}
                    value={chartInfo.yMax}
                    onChange={handleYMaxIntervalChange}
                  />
                </Column>
              </Row>
            </Column>
          </Row>

          <Separator />

          {/* Gain Settings */}
          <span>Gain Settings:</span>
          <Row marginTop="1rem">
            <Column width="20%">
              <label htmlFor={gainId}>Series Gain:</label>
            </Column>
            <Column width="80%">
              <input
                id={gainId}
                type={'number'}
                min={0}
                tabIndex={3}
                value={seriesInfo.gainVal}
                onChange={handleGainValueChange}
              />
            </Column>
          </Row>
        </Popover>
      </>
    );
  },
);
