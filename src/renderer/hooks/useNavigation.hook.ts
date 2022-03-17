import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

/**
 * A hook that navigates the app on AppState change
 */
const useNavigation = () => {
  const appState = useSelector((state: any) => state.appState.value);
  const history = useHistory();

  useEffect(() => {
    history.push(appState);
  }, [appState]);

  return useNavigation;
};

export default useNavigation;
