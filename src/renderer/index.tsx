import React from 'react';
import ReactDOM from 'react-dom';

// Redux Import
import { Provider } from 'react-redux';
import store from './redux/store';

import App from './App';

const container = document.getElementById('root') as HTMLDivElement;
container.innerHTML = '';

// Create a root

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  container
);
