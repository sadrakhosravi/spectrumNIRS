import React from 'react';
import { createRoot } from 'react-dom/client';

// Components
import App from './App';

// Chart Engine
// import './charts/Chart';

const container = document.getElementById('main') as HTMLElement;
const root = createRoot(container);

root.render(<App />);
