/**
 * Redux does not support non-serializable values, but React Context API does.
 * Both record and review charts will be set to the global context in order for
 * them to be accessible easily and being able to clean them completely from memory.
 */

import React, { createContext, useContext, useState } from 'react';
import RecordChart from 'renderer/charts/ChartClass/RecordChart';
import ReviewChart from 'renderer/charts/ChartClass/ReviewChart';

interface IChartContext {
  recordChart: RecordChart | undefined;
  setRecordChart: React.Dispatch<React.SetStateAction<RecordChart | undefined>>;
  reviewChart: ReviewChart | undefined;
  setReviewChart: React.Dispatch<React.SetStateAction<ReviewChart | undefined>>;
}

//@ts-ignore
const ChartContext = createContext<IChartContext>({});

const ChartProvider = ({ children }: { children: any }) => {
  const [recordChart, setRecordChart] = useState<RecordChart | undefined>(
    undefined
  );
  const [reviewChart, setReviewChart] = useState<ReviewChart | undefined>(
    undefined
  );

  return (
    <ChartContext.Provider
      value={{ recordChart, setRecordChart, reviewChart, setReviewChart }}
    >
      {children}
    </ChartContext.Provider>
  );
};

export const useChartContext = () => useContext(ChartContext);

export default ChartProvider;
