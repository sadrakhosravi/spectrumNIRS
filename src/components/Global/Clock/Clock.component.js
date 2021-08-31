import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [timeState, setTimeState] = useState();

  //Initialize the time on component mount
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const date = new Date();
      setTimeState(date.toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timerInterval); //Prevent memory leaks (if needed)
    };
  }, []);

  return <p className="text-2xl">{timeState}</p>;
};

export default Clock;
