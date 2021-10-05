import { useEffect, useState } from 'react';

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
      window.api.removeRecentExperimentEventListeners();
    };
  }, []);

  return recentExperimentData;
};

export default useGetRecentExperiments;
