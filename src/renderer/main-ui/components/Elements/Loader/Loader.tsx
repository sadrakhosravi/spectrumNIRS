import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { observer } from 'mobx-react-lite';

// Styles
import styles from './loader.module.scss';

// View models
import { appRouterVM } from '@store';

// Create portal element
const createPortalElement = (id: string) => {
  const div = document.createElement('div');
  div.id = id;
  document.body.appendChild(div);
};

// Remove portal element
const removePortalElement = (id: string) => {
  document.getElementById(id)?.remove();
};

const loaderPortalId = 'spectrum-loading-portal';

// Component
export const Loader = observer(() => {
  const [loader, setLoader] = React.useState({
    status: false,
    transparent: false,
    message: '',
  });

  // Listen for changes and update the component
  React.useEffect(() => {
    // Create / remove the portal element
    if (appRouterVM.isLoading.status && !loader.status) {
      createPortalElement(loaderPortalId);
    } else {
      removePortalElement(loaderPortalId);
    }

    setLoader(appRouterVM.isLoading);
  }, [appRouterVM.isLoading]);

  return (
    <>
      {loader.status &&
        ReactDOM.createPortal(
          <div
            className={`${styles.LoaderContainer} ${
              loader.transparent ? styles.LoaderTransparent : styles.LoaderSolid
            }`}
          >
            <div className={styles.Loader} />
            <span className="text-larger">
              {loader.message || 'Loading...'}
            </span>
          </div>,
          document.getElementById(loaderPortalId) as HTMLDivElement
        )}
    </>
  );
});
