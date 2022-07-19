import * as React from 'react';

// Styles
import styles from './rangeSlider.module.scss';

type RangeSliderType = {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  id?: string;
  onMouseUp?:
    | React.MouseEventHandler<HTMLInputElement>
    | React.TouchEventHandler<HTMLInputElement>;
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
      type="range"
      id={id}
      className={styles.Slider}
      value={value}
      min={min?.toString() || '0'}
      max={max?.toString() || '0'}
      step={step || 1}
      onTouchEnd={onMouseUp as React.TouchEventHandler<HTMLInputElement>}
      onChange={onChange}
      onMouseUp={onMouseUp as React.MouseEventHandler<HTMLInputElement>}
      tabIndex={-1}
    />
  );
};
