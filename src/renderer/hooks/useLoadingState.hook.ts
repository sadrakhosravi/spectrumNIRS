import { isLoading } from '@redux/IsLoadingSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

/**
 * Sets the global is loading state of the app
 * @returns {Hook} - useLoadingState Hook
 */
const useLoadingState = (state: true | false) => {
  const dispatch = useDispatch();
  useEffect(() => {
    requestAnimationFrame(() => {
      dispatch(isLoading(state));
    });
  });

  return useLoadingState;
};

export default useLoadingState;
