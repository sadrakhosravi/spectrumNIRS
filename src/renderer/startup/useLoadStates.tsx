import { useEffect } from 'react';
import GlobalStore from '@lib/globalStore/GlobalStore';

import { useAppDispatch } from '@redux/hooks/hooks';
import { setCurrentProbe } from '@redux/SensorStateSlice';
import { setGlobalState } from '@redux/globalStateSlice';

// Channels
import { ProbeChannels } from '@utils/channels';

const useLoadStates = () => {
  const dispatch = useAppDispatch();
  let unSubscribeGlobalStore: any;
  useEffect(() => {
    (async () => {
      const currentProbe = await window.api.invokeIPC(
        ProbeChannels.GetCurrentProbe
      );
      dispatch(setCurrentProbe(currentProbe));

      // Load the global store (Electron store used by the main process)
      requestAnimationFrame(() =>
        dispatch(setGlobalState(GlobalStore.store.store))
      );
      unSubscribeGlobalStore = GlobalStore.store.onDidAnyChange(() => {
        dispatch(setGlobalState(GlobalStore.store.store));
      });
    })();

    return () => unSubscribeGlobalStore();
  }, []);
};
export default useLoadStates;
