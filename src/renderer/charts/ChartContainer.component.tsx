import { useAppSelector } from '@redux/hooks/hooks';
import React from 'react';
import ChannelUI from './ChartClass/ChannelUI/Channels.component';
import RecordChart from './ChartClass/RecordChart';
import ReviewChart from './ChartClass/ReviewChart';

type ChartContainerProps = {
  chart?: ReviewChart | RecordChart | undefined;
  children: any;
};

const ChartLayout = ({ children }: ChartContainerProps) => {
  return (
    <div className="bg-grey3 h-full w-full">
      <div className=" h-full w-full">{children}</div>
    </div>
  );
};

export const ChartContainer = ({ children, chart }: ChartContainerProps) => {
  console.log(chart);
  const currentProbe = useAppSelector(
    (state) => state.sensorState.currentProbe
  );

  return (
    <div className="h-[calc(100%-50px)] bg-dark2">
      <div className="h-full flex">
        <div className="absolute top-0 left-0 w-full h-6 border-b-1 border-x-1 border-grey5 text-sm text-center">
          <p className="h-full">Probe Data</p>
        </div>
        <div className="basis-6 h-full border-l-1 border-r-1 border-grey5 ">
          <div className="w-6 absolute top-1/2 left-0 transform-origin: center text-sm -rotate-90 whitespace-nowrap text-white">
            <p>
              {currentProbe?.name} - {currentProbe?.device?.name}
            </p>
          </div>
        </div>
        <div className="w-[calc(100%-1.5rem)] h-[calc(100%-3rem)] absolute top-[1.5rem] left-[1.5rem] overflow-y-auto chart-scrollbar border-r-1 border-grey5">
          <div className="absolute top-0 left-0 w-[100px] h-full">
            <ChannelUI chart={chart} />
          </div>
          <div className="absolute top-0 right-0 h-full w-[calc(100%-100px)] ml-auto">
            {children}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-6 pl-6 border-1 border-l-0 border-grey5 text-sm flex justify-end"></div>
      </div>
    </div>
  );
};

export default ChartLayout;
