import React from 'react';

/** */
const withContainer = (WrappedComponent: JSX.Element | any) => {
  function HOC(props: any) {
    return (
      <>
        <main className="main-container">
          <WrappedComponent {...props} />
        </main>
      </>
    );
  }
  return HOC;
};

export default withContainer;
