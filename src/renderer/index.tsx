import React from 'react';
import ReactDOM from 'react-dom';

// Redux Import
import { Provider } from 'react-redux';
import store from './redux/store';

import('./UIWorkerManager');
// import('./UIModels/RecordingUI');

export const loadUI = async () => {
  const container = document.getElementById('root') as HTMLDivElement;
  container.innerHTML = '';

  const App = (await import('./App')).default;
  const ChartProvider = (await import('./context/ChartProvider')).default;

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

const { ipcRenderer } = require('electron');

ipcRenderer.send('is-main-loaded');
ipcRenderer.on('main-loaded', () => loadUI());
