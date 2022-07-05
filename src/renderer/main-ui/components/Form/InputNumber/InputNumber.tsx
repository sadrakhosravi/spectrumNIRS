import * as React from 'react';

// Styles
import styles from './inputNumber.module.scss';

type InputNumberType = {
  type?: React.HTMLInputTypeAttribute;
  value?: string | number;
  min?: number;
  max?: number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
};

export const InputNumber = ({
  type,
  value,
  min,
  max,
  onChange,
  onFocus,
  onBlur,
}: InputNumberType) => {
  return (
    <input
      className={`${styles.InputNumber}`}
      value={value}
      min={min}
      max={max}
      type={type || 'number'}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
};
