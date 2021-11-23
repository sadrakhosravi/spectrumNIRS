import { useAppSelector } from '@redux/hooks/hooks';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';

const ChartWebView = () => {
  const [recordCount, setRecordCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const location = useLocation();
  const recordWebViewRef = useRef<HTMLElement | any>(null);
  const currentDir = window.api.dirname();

  const isReviewInNewTab = useAppSelector(
    (state) => state.appState.reviewTabInNewWindow
  );
  console.log(isReviewInNewTab);

  useEffect(() => {
    const webview = document.getElementById('recordWebView') as
      | HTMLElement
      | any;
    if (location.pathname === '/main/recording/record') {
      webview.style.display = 'flex';
      if (recordCount === 0) {
        webview.loadURL('http://localhost:1212#/tabs/recording/record');
      }

      setRecordCount(1);
    } else {
      webview.style.display = 'none';
    }
  }, [location]);

  useEffect(() => {
    const webview = document.getElementById('reviewWebView') as
      | HTMLWebViewElement
      | any;
    if (!isReviewInNewTab) {
      if (location.pathname === '/main/recording/review') {
        webview.style.display = 'flex';
        reviewCount === 0 &&
          webview.loadURL('http://localhost:1212#/tabs/recording/review');
        reviewCount === 0 && webview.openDevTools();

        setReviewCount(1);
      } else {
        webview.style.display = 'none';
      }
    }
  }, [location]);

  return (
    <div className="absolute top-0 left-0 h-full w-full">
      <webview
        src="about:blank"
        ref={recordWebViewRef}
        id="recordWebView"
        className="w-full h-full flex"
        preload={`${currentDir}/preload.js`}
        partition="persist:spectrum"
      ></webview>

      <webview
        src="about:blank"
        id="reviewWebView"
        className="w-full h-full flex"
        preload={`${currentDir}/preload.js`}
        partition="persist:spectrum"
      ></webview>
    </div>
  );
};
export default React.memo(ChartWebView);
