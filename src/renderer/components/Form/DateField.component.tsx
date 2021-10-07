import React, { useEffect, useState } from 'react';

const DateField = (props: any) => {
  const [date, setDate] = useState('2021-01-01');

  useEffect(() => {
    // Get today's Date
    const date = new Date();
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;

    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

    setDate(`${date.getFullYear()}-${month}-${day}`);
  }, []);

  const handleDateChange = (event: any) => {
    setDate(event.target.value);
  };

  return (
    <input
      type="date"
      min="1900-01-01"
      value={date}
      {...props.register}
      onChange={(e) => {
        handleDateChange(e);
      }}
      className="px-3 py-2 w-full bg-light text-dark focus:ring-2 ring-accent rounded-sm"
    />
  );
};

export default DateField;
