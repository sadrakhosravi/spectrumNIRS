import useNavigation from '@hooks/useNavigation.hook';

/**
 * A dummy component to be used with React Router DOM in order to redirect based on the appState value.
 */
const RouteHandler = () => {
  useNavigation();

  return null;
};
export default RouteHandler;
