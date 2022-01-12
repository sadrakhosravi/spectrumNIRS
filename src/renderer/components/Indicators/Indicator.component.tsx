import React from 'react';

type IndicatorProps = {
  text: string;
  title?: string;
  color?: 'green' | 'rose' | 'yellow' | 'cyan';
};

const Indicator = ({ text, title, color = 'green' }: IndicatorProps) => {
  return (
    <>
      <div
        className={`flex items-center px-3 h-[30px] gap-2 z-50 bg-${color}-300 no-drag`}
        title={title}
      >
        <span className={`w-3 h-3 rounded-full bg-${color}-600`}></span>
        <span className={`text-sm text-${color}-800`}>{text}</span>
      </div>
      {/** In order for tailwind css to include the classes, a dummy hidden component is required */}
      <i className="bg-green-300 bg-rose-300 bg-yellow-300 bg-green-600 bg-rose-600 bg-yellow-600 text-green-800 text-rose-800 text-yellow-800 bg-cyan-300 bg-cyan-600 text-cyan-800 hidden"></i>
    </>
  );
};
export default Indicator;
