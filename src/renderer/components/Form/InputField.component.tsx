import React from 'react';

interface IInputField
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  register?: any;
  type?: string;
  placeholder?: string;
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
    placeholder,
    disabled,
    ...others
  } = props;
  return (
    <input
      type={type || 'text'}
      defaultValue={defaultValue || undefined}
      {...register}
      className={`h-[34px] w-full rounded-sm px-3 py-2 ring-accent focus:ring-2 ${
        className || 'bg-light text-dark '
      } ${disabled && '.placeholder-disabled cursor-not-allowed bg-light2'}`}
      placeholder={placeholder}
      id={register ? register.name : undefined}
      disabled={disabled}
      {...others}
      onFocus={(e) => e.target.focus()}
    />
  );
};

export default InputField;
