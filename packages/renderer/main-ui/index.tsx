import React from 'react';
import { createRoot } from 'react-dom/client';
import http from 'http';
console.log(http);
// Components
import App from './App';

// Data
import '@models/Data/DataModel';

// View Model Store
import '@store';

// IPC Service
import './MainWinIPCService';

const container = document.getElementById('main') as HTMLElement;
const root = createRoot(container);

root.render(<App />);
