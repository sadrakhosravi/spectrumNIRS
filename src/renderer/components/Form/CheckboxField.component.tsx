import React from 'react';

type CheckBoxFieldProps = {
  register?: any;
  id?: string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  checked?: boolean;
};

const CheckBoxField = ({
  register,
  id,
  className,
  onChange,
  checked = false,
}: CheckBoxFieldProps) => {
  return (
    <input
      type={'checkbox'}
      id={id}
      checked={register ? undefined : checked}
      onChange={onChange}
      className={`h-[18px] w-[18px] ${className || ''} `}
      {...register}
    ></input>
  );
};

export default CheckBoxField;
