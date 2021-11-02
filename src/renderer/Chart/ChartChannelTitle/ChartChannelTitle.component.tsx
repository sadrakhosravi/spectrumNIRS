import React from 'react';

type ChartChannelTitleProps = {
  text: string;
  color: string;
  isLast?: boolean;
};

const ChartChannelTitle = ({ text, color, isLast }: ChartChannelTitleProps): JSX.Element => {
  const border = isLast ? 'border-b-0' : 'border-b-6';
  const frequencyPosition = isLast ? 'bottom-4' : 'bottom-2';

  return (
    <div
      className={`h-full relative grid items-center content-center mt-0.1 ${border} text-center justify-items-center border-black`}
    >
      <span className="-mt-4 mb-1">{text}</span>
      <span className={`p-3 bg-${color} w-4`} />
      <span className={`text-sm absolute left-1/3 ${frequencyPosition}`}>
        F: 100Hz
      </span>
    </div>
  );
};

export default ChartChannelTitle;
