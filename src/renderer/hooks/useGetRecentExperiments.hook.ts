import { useEffect, useState } from 'react';
const on = window.api.on;
const send = window.api.send;
const removeListener = window.api.removeListener;

/**
 * Get the x most recent experiments
 */
const useGetRecentExperiments: (
  numOfRecentExperiments: number
) => Array<Object> = (numOfRecentExperiments) => {
  // Recent experiment data
  const [recentExperimentData, setRecentExperimentData]: [
    Array<JSX.Element>,
    any
  ] = useState([]); //

  // Only get the recent experiments on first render
  useEffect(() => {
    send('db:get-recent-experiments', numOfRecentExperiments); // Request recent-experiments
    on('db:recent-experiments', (_event: any, data: any) => {
      setRecentExperimentData(data);
      console.log(data);
    });

    return () => {
      // Cleanup - remove listeners
      removeListener('db:get-recent-experiments', () => {});
      removeListener('db:recent-experiments', () => {});
    };
  }, []);

  return recentExperimentData;
};

export default useGetRecentExperiments;
