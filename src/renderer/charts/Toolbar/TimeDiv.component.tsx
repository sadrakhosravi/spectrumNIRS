import React, { useEffect, useState } from 'react';
import ButtonMenu, {
  ButtonMenuItem,
} from '@components/Buttons/ButtonMenu.component';

// Icons
import TimeDivisionIcon from '@icons/time-division.svg';
import { useChartContext } from 'renderer/context/ChartProvider';
import { ChartType } from '@utils/constants';

type TimeDiv = {
  label: string;
  value: number;
};

const ms = 1000;

const timeDivisions = [
  {
    label: '100 ms',
    value: 100,
  },
  {
    label: '1 s',
    value: 1 * ms,
  },
  {
    label: '5 s',
    value: 5 * ms,
  },
  {
    label: '10 s',
    value: 10 * ms,
  },
  {
    label: '15 s',
    value: 15 * ms,
  },
  {
    label: '30 s',
    value: 30 * ms,
  },
  {
    label: '45 s',
    value: 45 * ms,
  },
  {
    label: '60 s',
    value: 60 * ms,
  },
  {
    label: '120 s',
    value: 120 * ms,
  },
];

const TimeDiv = ({ type }: { type: ChartType }) => {
  const [currentTimeDiv, setCurrentTimeDiv] = useState('');

  const chart =
    useChartContext()[
      `${type === ChartType.RECORD ? 'recordChart' : 'reviewChart'}`
    ];

  useEffect(() => {
    const timeDiv = chart?.chartOptions?.getTimeDivision() as number;
    if (timeDiv) {
      setCurrentTimeDiv(
        timeDivisions.filter((time) => time.value === timeDiv)[0].label
      );
    }
  }, [chart]);

  const setTimeDivision = (time: TimeDiv) => {
    chart?.chartOptions?.setTimeDivision(time.value);
    setCurrentTimeDiv(time.label);
  };

  return (
    <ButtonMenu text={currentTimeDiv} icon={TimeDivisionIcon}>
      {timeDivisions.map((timeDiv) => (
        <ButtonMenuItem
          text={timeDiv.label}
          key={timeDiv.label + 'timeDiv'}
          onClick={() => {
            setTimeDivision(timeDiv);
          }}
        />
      ))}
    </ButtonMenu>
  );
};
export default TimeDiv;
