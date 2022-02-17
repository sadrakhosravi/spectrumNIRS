import React from 'react';

type SelectFieldProps = {
  register?: any;
  defaultValue?: string | number;
  className?: string;
  children?: JSX.Element | JSX.Element[];
};

const SelectField = (props: SelectFieldProps): JSX.Element => {
  const { register, defaultValue, className, children } = props;
  return (
    <select
      defaultValue={defaultValue || undefined}
      {...register}
      className={`h-40px w-full rounded-sm px-3 py-2 ring-accent focus:ring-2 ${
        className || 'bg-light text-dark'
      }`}
      id={register ? register.name : undefined}
    >
      {children}
    </select>
  );
};

type SelectOptionProps = {
  name: string;
  value: string | number;
};

export const SelectOption = ({ name, value }: SelectOptionProps) => {
  return (
    <option className={``} value={value}>
      {name}
    </option>
  );
};

export default SelectField;
