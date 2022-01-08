import React, { useState } from 'react';

const TimeDivision = ({ chartOptions }: any) => {
  const timeDivisions = ['5s', '10s', '30s', '60s', '300s'];
  const [activeTime, setActiveTime] = useState(
    timeDivisions[timeDivisions.length - 1]
  );

  return (
    <div className="text-center w-full">
      <p>Time Division</p>
      <div className="flex h-10 items-center">
        {timeDivisions.map((timeDivision) => (
          <button
            key={timeDivision}
            className={`h-10 px-3 mx-2 hover:bg-grey3 active:bg-accent rounded-md ${
              activeTime === timeDivision && 'bg-accent'
            }`}
            onClick={() => {
              chartOptions.setTimeDivision(parseInt(timeDivision) * 1000);
              setActiveTime(timeDivision);
            }}
          >
            {timeDivision}
          </button>
        ))}
      </div>
    </div>
  );
};
export default TimeDivision;
