import React from 'react';

const MainApp = () => {
  return (
    <div className="h-1/2 w-1/2">
      <webview
        src="https://www.github.com/"
        preload="../../controllers/tabPreload.js"
      ></webview>
    </div>
  );
};
export default MainApp;
