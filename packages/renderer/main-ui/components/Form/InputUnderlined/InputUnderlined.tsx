import * as React from 'react';

// Styles
import * as styles from './inputUnderlined.module.scss';

type InputUnderlinedType = {
  type?: React.HTMLInputTypeAttribute;
  value?: string | number;
  min?: number;
  max?: number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
};

export const InputUnderlined = ({
  type,
  value,
  min,
  max,
  onChange,
  onFocus,
  onBlur,
}: InputUnderlinedType) => {
  return (
    <input
      className={`${styles.InputUnderlined}`}
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
