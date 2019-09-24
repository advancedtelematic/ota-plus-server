import ReactDOM from 'react-dom';
import React, { Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import './i18n';
import configureStore from './store';

import '../style/index.scss';

const store = configureStore();

import App from './App';

ReactDOM.render(
  <Suspense fallback="">
    <HashRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </HashRouter>
  </Suspense>,
  document.getElementById('app') as HTMLElement
);
