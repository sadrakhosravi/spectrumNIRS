import React from 'react';

interface IInputField {
  register: any;
  type?: string;
  defaultValue?: string | number;
}

const InputField = ({
  register,
  type,
  defaultValue,
}: IInputField): JSX.Element => {
  return (
    <input
      type={type || 'text'}
      value={defaultValue || undefined}
      {...register}
      className="px-3 py-2 w-full bg-light text-dark focus:ring-2 ring-accent rounded-sm"
      id={register.name}
    />
  );
};

export default InputField;
