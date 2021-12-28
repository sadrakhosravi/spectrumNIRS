import React from 'react';

type ChartContainerProps = {
  children: any;
};

const ChartLayout = ({ children }: ChartContainerProps) => {
  return (
    <div className="bg-grey3 h-full w-full">
      <div className=" h-full w-full drop-shadow-2xl ">{children}</div>
    </div>
  );
};

export const ChartContainer = ({ children }: ChartContainerProps) => {
  return (
    <div className="h-[calc(100%-50px)] bg-dark2">
      <div className="h-full flex">
        <div className="absolute top-0 left-0 w-full h-6 border-b-1 border-x-1 border-grey5 text-sm text-center">
          Sensor Data
        </div>
        <div className="basis-6 h-full border-l-1 border-r-1 border-grey5 ">
          <div className="w-6 absolute top-1/2 left-0 transform-origin: center text-xs -rotate-90 whitespace-nowrap text-white">
            Probe 1 - NIRS V5
          </div>
        </div>
        <div className="w-[calc(100%-1.5rem)] h-[calc(100%-3rem)] absolute top-[1.5rem] left-[1.5rem] overflow-y-auto chart-scrollbar border-r-1 border-grey5">
          {children}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-6 pl-6 border-1 border-l-0 border-grey5 text-sm flex justify-end">
          Zoom level: 1:1
        </div>
      </div>
    </div>
  );
};

export default ChartLayout;
