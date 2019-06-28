/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import axios from 'axios';
import { observe, observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import Routes from '../Routes';

import { FadeAnimation, WebsocketHandler } from '../utils';
import { doLogout } from '../utils/Common';
import { getCurrentLocation } from '../utils/Helpers';
import { VIEWPORT_MIN_WIDTH, VIEWPORT_MIN_HEIGHT } from '../config';
import { LegalInfoFooter, Navigation, SizeVerify, UploadBox } from '../partials';
import Wizard from '../components/campaigns/Wizard';
import { Minimized } from '../components/minimized';

@inject('stores')
@observer
class Main extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    location: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({}),
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
    const { stores } = this.props;
    const { userStore, featuresStore } = stores;
    if (this.uiUserProfileMenu) {
      await featuresStore.fetchFeatures();
      userStore.fetchUser();
      const { alphaPlusEnabled } = featuresStore;
      if (alphaPlusEnabled) {
        userStore.getOrganizations();
      }
      userStore.fetchContracts();
    }
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
    const { router } = this.context;
    const wizard = (
      <Wizard
        location={getCurrentLocation(router)}
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
    const { router } = this.context;
    if (!userStore.isTermsAccepted() && !router.isActive('/')) {
      history.push('/');
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
    const { router } = this.context;
    const pageId = `page-${getCurrentLocation(router) || 'dashboard'}`;
    const { stores, ...rest } = this.props;
    const { featuresStore, userStore } = stores;
    const { alphaPlusEnabled } = featuresStore;
    const isTermsAccepted = userStore.isTermsAccepted();
    const contractsCheckCompleted = userStore.contractsCheckCompleted();
    return (
      <span>
        <div>
          {((contractsCheckCompleted && isTermsAccepted) || !this.uiUserProfileMenu) && (
            <Navigation
              location={pageId}
              toggleSWRepo={this.toggleSWRepo}
              uiUserProfileEdit={this.uiUserProfileEdit}
              switchToSWRepo={this.switchToSWRepo}
              uiUserProfileMenu={this.uiUserProfileMenu}
              uiCredentialsDownload={this.uiCredentialsDownload}
              alphaPlusEnabled={alphaPlusEnabled}
              addNewWizard={this.addNewWizard}
            />
          )}
          <div className="app-flex-container">
            <div id={pageId} className={alphaPlusEnabled ? 'alpha-plus' : undefined}>
              <FadeAnimation>
                <Routes
                  {...rest}
                  addNewWizard={this.addNewWizard}
                  uiUserProfileEdit={this.uiUserProfileEdit}
                  switchToSWRepo={this.switchToSWRepo}
                  uiAutoFeatureActivation={this.uiAutoFeatureActivation}
                  uiUserProfileMenu={this.uiUserProfileMenu}
                  uiCredentialsDownload={this.uiCredentialsDownload}
                />
              </FadeAnimation>
              <SizeVerify minWidth={VIEWPORT_MIN_WIDTH} minHeight={VIEWPORT_MIN_HEIGHT} />
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
              <LegalInfoFooter />
            )}
          </div>
        </div>
      </span>
    );
  }
}

Main.wrappedComponent.contextTypes = {
  router: PropTypes.shape({}).isRequired,
};

export default withRouter(Main);
