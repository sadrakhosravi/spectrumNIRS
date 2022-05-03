import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Components
import { Row, Column } from '/@/components/Elements/Grid';
import { Separator } from '/@/components/Elements/Separator';

// View Models
import { vm } from '/@/views/Chart/ChartView';

export const ChartSettingsTab = observer(() => {
  const changeChartsYScale = (e: React.ChangeEvent<HTMLInputElement>, minOrMax: 'max' | 'min') => {
    const value = ~~e.target.value;
    if (isNaN(value)) return;

    vm.charts.forEach((chart) => {
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

  return (
    <>
      {/* Changes all charts Y scale */}
      <span className="text-larger">Charts Y Scale</span>
      <Row marginTop="1rem" marginBottom="1rem">
        <Column width="50%">
          <span>Y Max:</span>
        </Column>
        <Column width="50%">
          <input
            type={'number'}
            onChange={(e) => changeChartsYScale(e, 'max')}
            min={-100000}
            max={100000}
          />
        </Column>
      </Row>
      <Row>
        <Column width="50%">
          <span>Y Min:</span>
        </Column>
        <Column width="50%">
          <input
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
          <span>Gain:</span>
        </Column>
        <Column width="50%">
          <input type={'number'} min={0} max={10000} />
        </Column>
      </Row>
    </>
  );
});
