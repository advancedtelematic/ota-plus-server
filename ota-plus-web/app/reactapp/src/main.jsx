/** @format */

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { ConfigProvider } from 'antd';

// import i18n (needs to be bundled)
import './i18n';

import stores from './stores';
import { DEFAULT_THEME_CONFIG } from './config';
import MainLayout from './layouts/Main';

const Main = () => (
  <HashRouter>
    <Provider stores={stores}>
      <ConfigProvider {...DEFAULT_THEME_CONFIG}>
        <MainLayout />
      </ConfigProvider>
    </Provider>
  </HashRouter>
);

ReactDOM.render(<React.Suspense fallback=""><Main /></React.Suspense>, document.getElementById('app'));
