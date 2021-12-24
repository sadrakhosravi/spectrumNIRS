import React from 'react';

type IndicatorProps = {
  text: string;
  color?: 'green' | 'rose' | 'yellow';
};

const Indicator = ({ text, color = 'green' }: IndicatorProps) => {
  return (
    <>
      <div
        className={`absolute flex items-center px-3 py-1 top-[7px] right-[200px] gap-2 z-50 bg-${color}-300 rounded-sm animate-pulse `}
      >
        <span className={`w-3 h-3 rounded-full bg-${color}-600`}></span>
        <span className={`text-sm text-${color}-800`}>{text}</span>
      </div>
      {/** In order for tailwind css to include the classes, a dummy hidden component is required */}
      <i className="bg-green-300 bg-rose-300 bg-yellow-300 bg-green-600 bg-rose-600 bg-yellow-600 text-green-800 text-rose-800 text-yellow-800 hidden"></i>
    </>
  );
};
export default Indicator;
