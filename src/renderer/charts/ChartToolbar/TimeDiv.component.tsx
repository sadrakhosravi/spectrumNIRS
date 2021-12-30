import React from 'react';
import ButtonMenu, {
  ButtonMenuItem,
} from '@components/Buttons/ButtonMenu.component';

// Icons
import TimeDivisionIcon from '@icons/time-division.svg';

const timeDivisions = [
  {
    label: '100 ms',
    value: 100,
  },
  {
    label: '1 s',
    value: 1000,
  },
  {
    label: '5 s',
    value: 5000,
  },
];

const TimeDiv = () => {
  return (
    <ButtonMenu text={timeDivisions[0].label} icon={TimeDivisionIcon}>
      {timeDivisions.map((timeDiv) => (
        <ButtonMenuItem text={timeDiv.label} />
      ))}
    </ButtonMenu>
  );
};
export default TimeDiv;
