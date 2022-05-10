import * as React from 'react';

// Styles
import * as styles from './rangeSlider.module.scss';

type RangeSliderType = {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  id?: string;
  onMouseUp?: React.MouseEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export const RangeSlider = ({
  min,
  max,
  step,
  value,
  id,
  onChange,
  onMouseUp,
}: RangeSliderType) => {
  return (
    <input
      type={'range'}
      id={id}
      className={styles.Slider}
      value={value}
      min={min?.toString() || '0'}
      max={max?.toString() || '0'}
      step={step || 1}
      onChange={onChange}
      onMouseUp={onMouseUp}
      tabIndex={-1}
    ></input>
  );
};
