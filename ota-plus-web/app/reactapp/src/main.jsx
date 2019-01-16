/** @format */

import React from 'react';
import { render } from 'react-dom';
import Routes from './Routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { Provider } from 'mobx-react';
import { DevicesStore, HardwareStore, GroupsStore, PackagesStore, CampaignsStore, ImpactAnalysisStore, FeaturesStore, ProvisioningStore, UserStore, UpdatesStore } from './stores';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#9ce2d8',
  },
  datePicker: {
    selectColor: '#48DAD0',
  },
  flatButton: {
    primaryTextColor: '#4B5151',
  },
});

const stores = {
  devicesStore: new DevicesStore(),
  hardwareStore: new HardwareStore(),
  groupsStore: new GroupsStore(),
  packagesStore: new PackagesStore(),
  campaignsStore: new CampaignsStore(),
  impactAnalysisStore: new ImpactAnalysisStore(),
  featuresStore: new FeaturesStore(),
  provisioningStore: new ProvisioningStore(),
  userStore: new UserStore(),
  updatesStore: new UpdatesStore(),
};

const Main = () => {
  injectTapEventPlugin();
  return (
    <Provider stores={stores}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <I18nextProvider i18n={i18n}>
          <Routes />
        </I18nextProvider>
      </MuiThemeProvider>
    </Provider>
  );
};

render(<Main />, document.getElementById('app'));
