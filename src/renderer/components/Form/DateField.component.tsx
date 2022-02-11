import React from 'react';

const DateField = (props: any) => {
  return (
    <input
      type="date"
      {...props.register}
      className="px-3 py-2 h-40px w-full bg-light text-dark focus:ring-2 ring-accent rounded-sm"
    />
  );
};

export default DateField;
