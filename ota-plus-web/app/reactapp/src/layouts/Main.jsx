/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import axios from 'axios';
import { observe, observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { notification } from 'antd';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { ThemeProvider } from 'styled-components';
import moment from 'moment';
import theme from '../theme';

import Routes from '../Routes';

import { FadeAnimation, WebsocketHandler } from '../utils';
import { doLogout } from '../utils/Common';
import { getCurrentLocation } from '../utils/Helpers';
import { UploadBox } from '../partials';
import { Footer } from '../partials/Footer';
import Navbar from '../partials/Navbar';
import SubNavBar from '../partials/SubNavBar';
import Wizard from '../components/campaigns/Wizard';
import { Minimized } from '../components/minimized';
import { LOCATION_ENVIRONMENTS, LOCATION_PROFILE } from '../constants/locationConstants';
import { getLanguage, getMomentLocale } from '../helpers/languageHelper';

const DASHBOARD_PATH = {
  OLD: '/',
  NEW: '/home'
};

const LIGHT_THEMED_PATHS = [
  LOCATION_ENVIRONMENTS,
  LOCATION_PROFILE
];

@inject('stores')
@observer
class Main extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    location: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({}),
    t: PropTypes.func.isRequired
  };

  @observable
  wizards = [];

  @observable
  minimizedWizards = [];

  @observable
  uploadBoxMinimized = false;

  @observable
  uiAutoFeatureActivation = document.getElementById('toggle-autoFeatureActivation').value === 'true';

  @observable
  uiUserProfileMenu = document.getElementById('toggle-userProfileMenu').value === 'true';

  @observable
  uiUserProfileEdit = document.getElementById('toggle-userProfileEdit').value === 'true';

  @observable
  uiCredentialsDownload = document.getElementById('toggle-credentialsDownload').value === 'true';

  @observable
  atsGarageTheme = document.getElementById('toggle-atsGarageTheme').value === 'true';

  constructor(props) {
    super(props);
    const { common } = axios.defaults.headers;
    common['Csrf-Token'] = document.getElementById('csrf-token-val').value;
    axios.interceptors.response.use(null, (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        this.callFakeWsHandler();
        doLogout();
      }
      return Promise.reject(error);
    });
    const { devicesStore, softwareStore, hardwareStore, campaignsStore, groupsStore, userStore } = props.stores;

    this.websocketHandler = new WebsocketHandler(document.getElementById('ws-url').value, {
      devicesStore,
      softwareStore,
      hardwareStore,
      campaignsStore,
      groupsStore,
    });
    this.logoutHandler = observe(userStore, (change) => {
      if (change.name === 'ifLogout' && change.object[change.name]) {
        this.callFakeWsHandler();
        doLogout();
      }
    });
  }

  componentWillMount() {
    const { history } = this.props;
    this.websocketHandler.init();
    window.atsGarageTheme = this.atsGarageTheme;
    history.listen(this.locationChange);
  }

  async componentDidMount() {
    const { history, stores, t } = this.props;
    const { userStore, featuresStore } = stores;
    if (this.uiUserProfileMenu) {
      await featuresStore.fetchFeatures();
      try {
        await userStore.fetchUser();
      } catch (error) {
        this.uiUserProfileMenu = false;
        notification.open({
          message: t('common.legacy.login_error_msg'),
          description: t('common.legacy.login_error_desc')
        });
        return;
      }
      if (history.location.pathname === DASHBOARD_PATH.OLD) {
        history.push(DASHBOARD_PATH.NEW);
      }
      userStore.getOrganizations();
      userStore.getCurrentOrganization();
      userStore.fetchContracts();
    }
    moment.locale(getMomentLocale(getLanguage()));
  }

  componentWillUnmount() {
    this.logoutHandler();
  }

  toggleWizard = (wizardId, wizardName, e) => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { softwareStore } = stores;
    const minimizedWizard = {
      id: wizardId,
      name: wizardName,
    };
    const wizardAlreadyMinimized = _.find(this.minimizedWizards, { id: wizardId });
    if (wizardAlreadyMinimized) {
      this.minimizedWizards.splice(_.findIndex(this.minimizedWizards, minimized => minimized.id === wizardId), 1);
      softwareStore.fetchPackages('packagesSafeFetchAsync');
    } else {
      this.minimizedWizards.push(minimizedWizard);
    }
  };

  addNewWizard = (skipStep = null) => {
    const { location } = this.props;
    const wizard = (
      <Wizard
        location={getCurrentLocation(location)}
        wizardIdentifier={this.wizards.length}
        hideWizard={this.hideWizard}
        toggleWizard={this.toggleWizard}
        minimizedWizards={this.minimizedWizards}
        skipStep={skipStep}
        key={this.wizards.length}
      />
    );
    this.wizards = this.wizards.concat(wizard);
  };

  hideWizard = (wizardIdentifier, e) => {
    const { stores } = this.props;
    const { campaignsStore } = stores;
    if (e) e.preventDefault();
    this.wizards = _.filter(this.wizards, wizard => parseInt(wizard.key, 10) !== parseInt(wizardIdentifier, 10));
    this.minimizedWizards.splice(_.findIndex(this.minimizedWizards, minimized => minimized.id === wizardIdentifier), 1);
    campaignsStore.resetFullScreen();
  };

  callFakeWsHandler = () => {
    const { stores } = this.props;
    const { devicesStore, softwareStore, hardwareStore, campaignsStore, groupsStore } = stores;
    const wsUrl = document.getElementById('ws-url').value.replace('bearer', 'logout');
    this.fakeWebsocketHandler = new WebsocketHandler(wsUrl, {
      devicesStore,
      softwareStore,
      hardwareStore,
      campaignsStore,
      groupsStore,
    });
    this.fakeWebsocketHandler.init();
  };

  locationChange = () => {
    const { stores, history } = this.props;
    const { userStore } = stores;
    const path = DASHBOARD_PATH.NEW;
    if (this.uiUserProfileMenu && !userStore.isTermsAccepted() && history.location.pathname !== path) {
      history.push(path);
    }
  };

  toggleUploadBoxMode = (e) => {
    if (e) e.preventDefault();
    this.uploadBoxMinimized = !this.uploadBoxMinimized;
  };

  toggleSWRepo = () => {
    this.switchToSWRepo = !this.switchToSWRepo;
  };

  navigate = (path) => {
    const { history } = this.props;
    history.push(path);
  };

  render() {
    const { location } = this.props;
    const pageId = `page-${getCurrentLocation(location) || 'dashboard'}`;
    const { stores, ...rest } = this.props;
    const { featuresStore, userStore } = stores;
    const { features } = featuresStore;
    const isTermsAccepted = userStore.isTermsAccepted();
    const contractsCheckCompleted = userStore.contractsCheckCompleted();
    return (
      <ThemeProvider theme={theme}>
        <div>
          {((contractsCheckCompleted && isTermsAccepted) || !this.uiUserProfileMenu) && (
            <div>
              <Navbar
                location={pageId}
                toggleSWRepo={this.toggleSWRepo}
                uiUserProfileEdit={this.uiUserProfileEdit}
                switchToSWRepo={this.switchToSWRepo}
                uiUserProfileMenu={this.uiUserProfileMenu}
                uiCredentialsDownload={this.uiCredentialsDownload}
                addNewWizard={this.addNewWizard}
              />
              <SubNavBar lightMode={LIGHT_THEMED_PATHS.includes(getCurrentLocation(location))} />
            </div>
          )}
          <div className="app-flex-container organizations">
            <div id={pageId}>
              <FadeAnimation>
                <Routes
                  {...rest}
                  addNewWizard={this.addNewWizard}
                  features={features}
                  uiUserProfileEdit={this.uiUserProfileEdit}
                  switchToSWRepo={this.switchToSWRepo}
                  uiAutoFeatureActivation={this.uiAutoFeatureActivation}
                  uiUserProfileMenu={this.uiUserProfileMenu}
                  uiCredentialsDownload={this.uiCredentialsDownload}
                />
              </FadeAnimation>
              <UploadBox minimized={this.uploadBoxMinimized} toggleUploadBoxMode={this.toggleUploadBoxMode} />
              {this.wizards}
              <Minimized
                uploadBoxMinimized={this.uploadBoxMinimized}
                toggleUploadBoxMode={this.toggleUploadBoxMode}
                minimizedWizards={this.minimizedWizards}
                toggleWizard={this.toggleWizard}
              />
            </div>
            {contractsCheckCompleted && isTermsAccepted && (
              <Footer />
            )}
          </div>
        </div>
      </ThemeProvider>
    );
  }
}

export default withTranslation()(withRouter(Main));
