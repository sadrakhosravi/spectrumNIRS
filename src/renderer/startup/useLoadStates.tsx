import { dispatch } from '@redux/store';

// Constants
import { ProbeChannels } from '@utils/channels';
import { setCurrentProbe } from '@redux/SensorStateSlice';
import { useEffect } from 'react';

const useLoadStates = () => {
  useEffect(() => {
    (async () => {
      const currentProbe = await window.api.invokeIPC(
        ProbeChannels.GetCurrentProbe
      );
      console.log(currentProbe);
      dispatch(setCurrentProbe(currentProbe));
    })();
  }, []);
};
export default useLoadStates;
