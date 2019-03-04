/** @format */

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'mobx-react';
import { ConfigProvider } from 'antd';
import { DEFAULT_THEME_CONFIG } from './config';
import i18n from './i18n';

import MainLayout from './layouts/Main';
import { DevicesStore, HardwareStore, GroupsStore, SoftwareStore, CampaignsStore, ImpactAnalysisStore, FeaturesStore, ProvisioningStore, UserStore, UpdatesStore } from './stores';

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
        <I18nextProvider i18n={i18n}>
          <MainLayout />
        </I18nextProvider>
      </ConfigProvider>
    </Provider>
  </HashRouter>
);

ReactDOM.render(<Main />, document.getElementById('app'));
