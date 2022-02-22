import { useAppSelector } from '@redux/hooks/hooks';
import { ChartType } from '@utils/constants';
import React from 'react';
import ChannelUI from './ChartClass/ChannelUI/Channels.component';

type ChartContainerProps = {
  children: any;
};

const ChartLayout = ({ children }: ChartContainerProps) => {
  return (
    <div className="h-full w-full bg-grey3">
      <div className=" h-full w-full">{children}</div>
    </div>
  );
};

export const ChartContainer = ({
  children,
  type,
}: ChartContainerProps & { type: ChartType }) => {
  const currentProbe = useAppSelector(
    (state) => state.sensorState.currentProbe
  );

  return (
    <div className="h-[calc(100%-50px)] bg-dark2">
      <div className="flex h-full">
        <div className="absolute top-0 left-0 h-6 w-full border-x-1 border-b-1 border-grey5 text-center text-sm">
          <p className="h-full">Probe Data</p>
        </div>
        <div className="h-full basis-6 border-l-1 border-r-1 border-grey5 ">
          <div className="transform-origin: center absolute top-1/2 left-0 w-6 -rotate-90 whitespace-nowrap text-sm text-white">
            <p>
              {currentProbe?.name} - {currentProbe?.device?.name}
            </p>
          </div>
        </div>
        <div className="chart-scrollbar absolute top-[1.5rem] left-[1.5rem] h-[calc(100%-3rem)] w-[calc(100%-1.5rem)] overflow-y-auto border-r-1 border-grey5">
          <div className="absolute top-0 left-0 h-full w-[130px]">
            <ChannelUI type={type} />
          </div>
          <div className="absolute top-0 right-0 ml-auto h-full w-[calc(100%-130px)]">
            {children}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 flex h-6 w-full justify-end border-1 border-l-0 border-grey5 pl-6 text-sm"></div>
      </div>
    </div>
  );
};

export default ChartLayout;
