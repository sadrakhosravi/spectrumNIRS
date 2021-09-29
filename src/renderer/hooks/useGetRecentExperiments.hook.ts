import { useEffect, useState } from 'react';
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
    (async () => {
      const experiments = await window.api.getRecentExperiments(
        numOfRecentExperiments
      );
      console.log(experiments);
      setRecentExperimentData(experiments);
    })();

    return () => {
      // Cleanup - remove listeners
      removeListener('db:get-recent-experiments', () => {});
      removeListener('db:recent-experiments', () => {});
    };
  }, []);

  return recentExperimentData;
};

export default useGetRecentExperiments;
