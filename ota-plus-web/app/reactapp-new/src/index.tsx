import ReactDOM from 'react-dom';
import React, { Suspense } from 'react';
import { HashRouter } from 'react-router-dom';

import './i18n';

import App from './App';

ReactDOM.render(
  <Suspense fallback="">
    <HashRouter>
      <App />
    </HashRouter>
  </Suspense>,
  document.getElementById('app') as HTMLElement
);
