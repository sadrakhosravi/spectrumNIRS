import React from 'react';

const DateField = (props: any) => {
  // Get today's Date
  const date = new Date();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;

  let dateToday = `${date.getFullYear()}-${month}-${date.getDate()}`;

  const handleDateChange = (event: any) => {
    dateToday = event.target.value;
  };

  return (
    <input
      type="date"
      min="2015-01-01"
      value={dateToday}
      {...props.register}
      onChange={(e) => {
        handleDateChange(e);
      }}
      className="px-3 py-2 w-full bg-light text-dark focus:ring-2 ring-accent"
    />
  );
};

export default DateField;
