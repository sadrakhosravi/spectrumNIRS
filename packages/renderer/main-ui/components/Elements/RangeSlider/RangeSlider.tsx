import * as React from 'react';

// Styles
import * as styles from './rangeSlider.module.scss';

type RangeSliderType = {
  min?: number;
  max?: number;
  step?: number;
  onMouseUp?: React.MouseEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export const RangeSlider = ({ min, max, step, onChange, onMouseUp }: RangeSliderType) => {
  return (
    <input
      type={'range'}
      className={styles.Slider}
      min={min?.toString() || '0'}
      max={max?.toString() || '0'}
      step={step || 1}
      onChange={onChange}
      onMouseUp={onMouseUp}
    ></input>
  );
};
