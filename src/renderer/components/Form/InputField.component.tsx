import React from 'react';

interface IInputField
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  register?: any;
  type?: string;
  defaultValue?: string | number;
  onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
  onKeyPress?: React.FormEventHandler<HTMLInputElement> | undefined;
  autoFocus?: boolean;
}

const InputField = (props: IInputField): JSX.Element => {
  const {
    register,
    type,
    defaultValue,
    className,
    onBlur,
    onKeyPress,
    autoFocus,
  } = props;
  return (
    <input
      type={type || 'text'}
      defaultValue={defaultValue || undefined}
      {...register}
      className={`px-3 py-2 w-full h-40px focus:ring-2 ring-accent rounded-sm ${
        className || 'bg-light text-dark'
      }`}
      id={register ? register.name : undefined}
      onBlur={onBlur}
      onKeyPress={onKeyPress}
      autoFocus={autoFocus}
      onFocus={(e) => e.target.focus()}
    />
  );
};

export default InputField;
