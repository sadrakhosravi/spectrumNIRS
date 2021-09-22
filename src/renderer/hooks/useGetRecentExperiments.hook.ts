import { useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');

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
    ipcRenderer.send('db:get-recent-experiments', numOfRecentExperiments); // Request recent-experiments
    ipcRenderer.on('db:recent-experiments', (_event, data) => {
      setRecentExperimentData(data);
      console.log(data);
    });

    return () => {
      // Cleanup - remove listeners
      ipcRenderer.removeListener('db:get-recent-experiments', () => {});
      ipcRenderer.removeListener('db:recent-experiments', () => {});
    };
  }, []);

  return recentExperimentData;
};

export default useGetRecentExperiments;
