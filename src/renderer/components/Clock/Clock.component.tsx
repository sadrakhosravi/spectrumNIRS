import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppState } from '@utils/constants';

const Clock = () => {
  const [timeState, setTimeState] = useState();
  const location = useLocation();

  // Initialize the time on component mount
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const date: any = new Date();
      setTimeState(date.toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timerInterval); // Prevent memory leaks (if needed)
    };
  }, []);

  return (
    <p
      className="text-2xl absolute right-4 top-[42px]"
      hidden={location.pathname === AppState.PROBE_CALIBRATION}
    >
      {timeState}
    </p>
  );
};

export default Clock;
