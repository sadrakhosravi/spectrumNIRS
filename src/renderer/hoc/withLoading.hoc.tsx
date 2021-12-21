import React, { useState } from 'react';

// Components
import LoadingIndicator from '@components/Loaders/LoadingIndicator.component';

/** */
const withLoading = (
  WrappedComponent: JSX.Element | any,
  loadingMessage: string
) => {
  function HOC(props: any) {
    const [isLoading, setIsLoading] = useState(true);

    const setLoadingState = (isComponentLoading: boolean) => {
      requestAnimationFrame(() => {
        setIsLoading(isComponentLoading);
      });
    };

    return (
      <>
        <WrappedComponent {...props} setLoading={setLoadingState}>
          {isLoading && <LoadingIndicator loadingMessage={loadingMessage} />}
        </WrappedComponent>
      </>
    );
  }
  return HOC;
};

export default withLoading;
