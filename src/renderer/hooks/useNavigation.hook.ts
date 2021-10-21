import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

/**
 * Checks the app state and navigates based on the current state.
 * @returns {String} - checkNavigation
 */
const useNavigation = () => {
  const appState = useSelector((state: any) => state.appState.value);
  const history = useHistory();
  console.log(history);

  useEffect(() => {
    // history.push(`/${appState}`);
  }, [appState]);

  return useNavigation;
};

export default useNavigation;
