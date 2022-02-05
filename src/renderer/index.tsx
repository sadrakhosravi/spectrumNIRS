import React from 'react';
import ReactDOM from 'react-dom';

// Redux Import
import { Provider } from 'react-redux';
import store from './redux/store';

// Components
import App from './App';
import ChartProvider from './context/ChartProvider';

// Workers
import '../workers/WorkerManager';

// Data Manager
import './DataManager/DataManager';

export const loadUI = async () => {
  const container = document.getElementById('root') as HTMLDivElement;
  container.innerHTML = '';

  // Enable shared array buffer in the window object
  if (!('SharedArrayBuffer' in window)) {
    (window as any).SharedArrayBuffer = ArrayBuffer;
  }

  ReactDOM.render(
    <React.StrictMode>
      <React.Suspense fallback={''}>
        <Provider store={store}>
          <ChartProvider>
            <App />
          </ChartProvider>
        </Provider>
      </React.Suspense>
    </React.StrictMode>,
    container
  );
};

window.api.sendIPC('is-main-loaded');
window.api.onIPCData('main-loaded', () => loadUI());
