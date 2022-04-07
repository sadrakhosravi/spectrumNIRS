import React from 'react';
import { createRoot } from 'react-dom/client';

import * as BetterSqlite3 from 'better-sqlite3';

console.log(BetterSqlite3);

const container = document.getElementById('app') as HTMLElement;
const root = createRoot(container);

root.render(React.createElement('div', null, 'Hello World2'));
