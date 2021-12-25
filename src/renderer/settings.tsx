import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import SettingsWindow from './windows/settings.component';

const container = document.getElementById('settings') as HTMLDivElement;
container.innerHTML = '';

// Create a root

ReactDOM.render(<SettingsWindow />, container);
