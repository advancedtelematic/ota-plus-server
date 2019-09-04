import ReactDOM from 'react-dom';
import React, { Suspense } from 'react';

import './i18n';

import App from './App';

ReactDOM.render(
  <Suspense fallback="">
    <App />
  </Suspense>,
  document.getElementById('app') as HTMLElement
);
