import React, { useEffect } from 'react';

const RecordWebView = () => {
  useEffect(() => {
    const webview: any = document.getElementById('record-web-view');
    webview.addEventListener('did-start-loading', function () {
      webview.openDevTools();
    });
  }, []);
  return (
    <webview
      id="record-web-view"
      className="h-full w-full"
      src="http://localhost:1212#/tabs/recording/record"
      preload={`file://${window.api.dirname()}/preload.js`}
      webpreferences="backgroundThrottling=false, contextIsolation=true,"
    ></webview>
  );
};
export default RecordWebView;
