import { useEffect } from 'react';
import { useAppDispatch } from '@redux/hooks/hooks';

// Constants
import { ProbeChannels } from '@utils/channels';
import { setCurrentProbe } from '@redux/SensorStateSlice';

const LoadStates = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const currentProbe = await window.api.invokeIPC(
        ProbeChannels.GetCurrentProbe
      );
      console.log(currentProbe);
      dispatch(setCurrentProbe(currentProbe));
    })();
  }, []);

  return null;
};
export default LoadStates;
