import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

/**
 * Checks the app state and navigates based on the current state.
 * @returns {Hook} - checkNavigation
 */
const checkNavigation = () => {
  const appState = useSelector((state: any) => state.appState.value);
  const history = useHistory();

  useEffect(() => {
    history.push(`${appState}`);
  }, [appState]);

  return checkNavigation;
};

export default checkNavigation;
