import * as React from 'react';

// Styles
import * as styles from './gain.module.scss';

// Icons
import { FiPlus, FiMinus } from 'react-icons/fi';

// View Model
import { vm } from '../../ChartView';

export const GainButton = () => {
  const [currValue, setCurrValue] = React.useState(1);

  const test = () => {
    setCurrValue(currValue + 2);
    const yAxis = vm.charts[0].dashboardChart.chart.getDefaultAxisY();
    yAxis.getInterval();

    yAxis.setTickStrategy('Numeric', (strategy) => {
      return strategy.setFormattingOffset(currValue - 2);
    });
  };

  return (
    <div className={styles.GainButtonContainer}>
      <button onClick={test}>
        <FiPlus size={16} />
      </button>
      <input type={'number'} className={styles.GainButtonInput} min={1} max={99} />
      <button>
        <FiMinus size={16} />
      </button>
    </div>
  );
};
