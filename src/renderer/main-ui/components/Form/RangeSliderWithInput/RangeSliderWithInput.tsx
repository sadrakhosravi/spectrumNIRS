import * as React from 'react';

// Styles
import styles from './rangeSliderWithInput.module.scss';

// Components
import { RangeSlider } from '../../Elements/RangeSlider';
import { InputNumber } from '../InputNumber';

type RangeSliderWithInputType = {
  title?: string;
  min?: number;
  max?: number;
  id?: string;
  defaultValue?: number;
  onBlur?: (value: number) => any;
};

export const RangeSliderWithInput = ({
  title,
  min,
  max,
  defaultValue,
  id,
  onBlur,
}: RangeSliderWithInputType) => {
  const [value, setValue] = React.useState(defaultValue || min || 0);

  const onValueChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Convert to number
      const newVal = ~~e.target.value;

      // Check if the number is in the range
      if (newVal)
        if (max && newVal > max) {
          setValue(max);
          return;
        }
      if (min && newVal < min) {
        setValue(min);
        return;
      }
      setValue(newVal);
    },
    []
  );

  const handleOnBlur = React.useCallback((e: any) => {
    const value = ~~e.target.value;
    onBlur && onBlur(value);
  }, []);

  return (
    <>
      <div className={styles.RangeSliderWithInput}>
        <span className={styles.RangeSliderSpan}>
          {title && <span className={styles.TitleSpan}>{title}</span>}
          <RangeSlider
            id={id}
            value={value}
            min={min}
            max={max}
            step={1}
            onChange={onValueChange}
            //@ts-ignore
            onMouseUp={
              handleOnBlur as React.MouseEventHandler<HTMLInputElement>
            }
          />
        </span>
        <span className={styles.InputSpan}>
          <InputNumber
            value={value}
            min={min}
            max={max}
            onChange={(e) => {
              onValueChange(e);
              handleOnBlur(e);
            }}
          />
        </span>
      </div>
    </>
  );
};
