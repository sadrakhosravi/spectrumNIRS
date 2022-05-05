import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from './chartSettings.module.scss';

// Components
import { Row, Column } from '/@/components/Elements/Grid';
import { Separator } from '/@/components/Elements/Separator';

// View Models
import { chartVM } from '@store';
import { Button } from '/@/components/Elements/Buttons';

export const ChartSettingsTab = observer(() => {
  const statusRef = React.useRef<HTMLSpanElement>(null);
  const yMinId = React.useId();
  const yMaxId = React.useId();
  const gainId = React.useId();

  // Changes the Y axis scale of all charts
  const changeChartsYScale = (e: React.ChangeEvent<HTMLInputElement>, minOrMax: 'max' | 'min') => {
    const value = ~~e.target.value;
    if (isNaN(value)) return;

    chartVM.charts.forEach((chart) => {
      const axisY = chart.dashboardChart.chart.getDefaultAxisY();

      if (minOrMax === 'max') {
        axisY.setInterval(axisY.getInterval().start, value, 0, true);
        return;
      }

      if (minOrMax === 'min') {
        axisY.setInterval(value, axisY.getInterval().end, 0, true);
        return;
      }
    });
  };

  const changeAllSeriesGains = React.useCallback(() => {
    const input = document.getElementById(gainId) as HTMLInputElement;
    const gainVal = parseFloat(input.value);
    if (gainVal < 0) return;

    chartVM.charts.forEach((chart) => {
      chart.series.length !== 0 && chart.series[0].setSeriesGain(gainVal);
    });

    input.value = '';

    if (statusRef.current) {
      statusRef.current.innerText = 'Gain Settings Applied To All Series!';

      setTimeout(() => {
        if (statusRef.current) statusRef.current.innerText = '';
      }, 3000);
    }
  }, []);

  return (
    <>
      {/* Changes all charts Y scale */}
      <span className="text-larger">Charts Y Scale</span>
      <Row marginTop="1rem" marginBottom="1rem">
        <Column width="50%">
          <label htmlFor={yMaxId}>Y Max:</label>
        </Column>
        <Column width="50%">
          <input
            id={yMaxId}
            type={'number'}
            onChange={(e) => changeChartsYScale(e, 'max')}
            min={-100000}
            max={100000}
          />
        </Column>
      </Row>
      <Row>
        <Column width="50%">
          <label htmlFor={yMinId}>Y Min:</label>
        </Column>
        <Column width="50%">
          <input
            id={yMinId}
            type={'number'}
            onChange={(e) => changeChartsYScale(e, 'min')}
            min={-100000}
            max={100000}
          />
        </Column>
      </Row>

      <Separator />

      {/* Changes all charts gain scale */}
      <span className="text-larger">Channels Gain</span>
      <Row marginTop="1rem" marginBottom="1rem">
        <Column width="50%">
          <label htmlFor={gainId}>Gain:</label>
        </Column>
        <Column width="50%">
          <input id={gainId} type={'number'} min={0} max={10000} step="any" />
        </Column>
      </Row>
      <span className={styles.ApplyGainButton}>
        <Button text="Apply Gain" onClick={changeAllSeriesGains} />
      </span>
      <div className="mt">
        Status: <span ref={statusRef}></span>
      </div>
    </>
  );
});
