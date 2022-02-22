import React from 'react';

type CheckBoxFieldProps = {
  register?: any;
  id?: string;
};

const CheckBoxField = ({ register, id }: CheckBoxFieldProps) => {
  return (
    <input
      type={'checkbox'}
      id={id}
      checked={undefined}
      onChange={undefined}
      className={`h-[18px] w-[18px] `}
      {...register}
    ></input>
  );
};

export default CheckBoxField;
