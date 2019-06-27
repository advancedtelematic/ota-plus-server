/** @format */

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { ConfigProvider } from 'antd';

// import i18n (needs to be bundled)
import './i18n';

import { DEFAULT_THEME_CONFIG } from './config';

import MainLayout from './layouts/Main';
import {
  CampaignsStore,
  DevicesStore,
  FeaturesStore,
  GroupsStore,
  HardwareStore,
  ImpactAnalysisStore,
  ProvisioningStore,
  SoftwareStore,
  UpdatesStore,
  UserStore
} from './stores';

const stores = {
  devicesStore: new DevicesStore(),
  hardwareStore: new HardwareStore(),
  groupsStore: new GroupsStore(),
  softwareStore: new SoftwareStore(),
  campaignsStore: new CampaignsStore(),
  impactAnalysisStore: new ImpactAnalysisStore(),
  featuresStore: new FeaturesStore(),
  provisioningStore: new ProvisioningStore(),
  userStore: new UserStore(),
  updatesStore: new UpdatesStore(),
};

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
