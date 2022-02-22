import React from 'react';

const DateField = (props: any) => {
  return (
    <input
      type="date"
      {...props.register}
      className="h-[34px] w-full rounded-sm bg-light px-3 py-2 text-dark ring-accent focus:ring-2"
    />
  );
};

export default DateField;
