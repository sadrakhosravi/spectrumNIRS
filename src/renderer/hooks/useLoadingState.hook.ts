import { isLoading } from '@redux/IsLoadingSlice';
import { useDispatch } from 'react-redux';

/**
 * Sets the global is loading state of the app
 * @returns {Hook} - useLoadingState Hook
 */
const useLoadingState = (state: true | false) => {
  const dispatch = useDispatch();

  dispatch(isLoading(state));

  return useLoadingState;
};

export default useLoadingState;
