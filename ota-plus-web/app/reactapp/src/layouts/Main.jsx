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
import { Navigation, SizeVerify, UploadBox } from '../partials';
import Wizard from '../components/campaigns/Wizard';
import { Minimized } from '../components/minimized';
import { WhatsNew } from '../components/whatsnew';

@inject('stores')
@observer
class Main extends Component {
  static propTypes = {
    stores: PropTypes.object,
    location: PropTypes.object.isRequired,
    history: PropTypes.object,
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
  @observable
  showWhatsNewPopover = false;
  @observable
  switchToSWRepo = false;
  @observable
  activeTab = {
    campaigns: 'prepared',
    packages: 'compact',
  };

  constructor(props) {
    super(props);
    const { common } = axios.defaults.headers;
    common['Csrf-Token'] = document.getElementById('csrf-token-val').value;
    axios.interceptors.response.use(null, error => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        this.callFakeWsHandler();
        doLogout();
      }
      return Promise.reject(error);
    });
    const { devicesStore, packagesStore, hardwareStore, campaignsStore, groupsStore, userStore } = props.stores;
    this.websocketHandler = new WebsocketHandler(document.getElementById('ws-url').value, {
      devicesStore,
      packagesStore,
      hardwareStore,
      campaignsStore,
      groupsStore,
    });
    this.logoutHandler = observe(userStore, change => {
      if (change.name === 'ifLogout' && change.object[change.name]) {
        this.callFakeWsHandler();
        doLogout();
      }
    });
  }

  componentWillMount() {
    const { stores, history } = this.props;
    const { userStore, featuresStore } = stores;
    if (this.uiUserProfileMenu) {
      userStore.fetchUser();
      userStore.fetchContracts();
      featuresStore.fetchFeatures();
    }
    this.websocketHandler.init();
    window.atsGarageTheme = this.atsGarageTheme;
    history.listen(this.locationChange);
    featuresStore.checkWhatsNewStatus();
  }

  componentWillUnmount() {
    this.logoutHandler();
  }

  toggleWizard = (wizardId, wizardName, e) => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { packagesStore } = stores;
    const minimizedWizard = {
      id: wizardId,
      name: wizardName,
    };
    const wizardAlreadyMinimized = _.find(this.minimizedWizards, { id: wizardId });
    if (wizardAlreadyMinimized) {
      this.minimizedWizards.splice(_.findIndex(this.minimizedWizards, minimized => minimized.id === wizardId), 1);
      packagesStore.fetchPackages('packagesSafeFetchAsync');
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
        activeTab={this.getActiveTab()}
        switchTab={this.switchTab}
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
    campaignsStore._resetFullScreen();
  };

  callFakeWsHandler = () => {
    const { stores } = this.props;
    const { devicesStore, packagesStore, hardwareStore, campaignsStore, groupsStore } = stores;
    const wsUrl = document.getElementById('ws-url').value.replace('bearer', 'logout');
    this.fakeWebsocketHandler = new WebsocketHandler(wsUrl, {
      devicesStore,
      packagesStore,
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
    if (!userStore._isTermsAccepted() && !router.isActive('/')) {
      history.push('/');
    }
  };

  updateCampaignsView = () => {
    const { router } = this.context;
    const { stores } = this.props;
    const { campaignsStore } = stores;
    if (getCurrentLocation(router) === 'campaigns' && !campaignsStore.campaignsFetchAsync[this.getActiveTab()].isFetching) {
      campaignsStore.fetchStatusCounts();
      campaignsStore.fetchCampaigns(this.getActiveTab());
    }
  };

  toggleUploadBoxMode = e => {
    if (e) e.preventDefault();
    this.uploadBoxMinimized = !this.uploadBoxMinimized;
  };

  toggleSWRepo = () => {
    this.switchToSWRepo = !this.switchToSWRepo;
  };

  showWhatsNew = () => {
    this.showWhatsNewPopover = true;
  };

  hideWhatsNew = () => {
    this.showWhatsNewPopover = false;
  };

  navigate = path => {
    const { history } = this.props;
    history.push(path);
  };

  switchTab = identifier => {
    const { router } = this.context;
    const location = getCurrentLocation(router);
    this.activeTab[location] = identifier;
    this.switchToSWRepo = this.activeTab[location] === 'advanced';
    this.updateCampaignsView();
  };

  getActiveTab = () => {
    const { router } = this.context;
    const location = getCurrentLocation(router);
    const locationHasTabs = location === 'packages' || location === 'campaigns';
    if (locationHasTabs) {
      return this.activeTab[location];
    }
    return '';
  };

  calcHeight = () => {
    const { router } = this.context;
    const currentLocation = getCurrentLocation(router);
    if (currentLocation === 'campaigns') {
      return 'calc(100vh - 100px)';
    }
    return 'calc(100vh - 50px)';
  };

  render() {
    const { router } = this.context;
    const pageId = `page-${getCurrentLocation(router) || 'home'}`;
    const { stores, ...rest } = this.props;
    const { userStore, featuresStore } = stores;
    const { alphaPlusEnabled, whatsNewPopOver } = featuresStore;
    const activeTab = this.getActiveTab();

    return (
      <span>
        <Navigation
          location={pageId}
          toggleSWRepo={this.toggleSWRepo}
          uiUserProfileEdit={this.uiUserProfileEdit}
          switchToSWRepo={this.switchToSWRepo}
          uiUserProfileMenu={this.uiUserProfileMenu}
          uiCredentialsDownload={this.uiCredentialsDownload}
          alphaPlusEnabled={alphaPlusEnabled}
          startWhatsNewPopover={this.showWhatsNew}
          switchTab={this.switchTab}
          activeTab={activeTab}
          addNewWizard={this.addNewWizard}
        />
        <div
          id={pageId}
          style={{
            height: this.calcHeight(),
            padding: !alphaPlusEnabled && pageId === 'page-packages' ? '30px' : '',
          }}
        >
          <FadeAnimation>
            <Routes
              {...rest}
              addNewWizard={this.addNewWizard}
              uiUserProfileEdit={this.uiUserProfileEdit}
              switchToSWRepo={this.switchToSWRepo}
              uiAutoFeatureActivation={this.uiAutoFeatureActivation}
              uiUserProfileMenu={this.uiUserProfileMenu}
              uiCredentialsDownload={this.uiCredentialsDownload}
              activeTab={activeTab}
              switchTab={this.switchTab}
            />
          </FadeAnimation>
          <SizeVerify minWidth={VIEWPORT_MIN_WIDTH} minHeight={VIEWPORT_MIN_HEIGHT} />
          <UploadBox minimized={this.uploadBoxMinimized} toggleUploadBoxMode={this.toggleUploadBoxMode} />
          {this.wizards}
          <Minimized uploadBoxMinimized={this.uploadBoxMinimized} toggleUploadBoxMode={this.toggleUploadBoxMode} minimizedWizards={this.minimizedWizards} toggleWizard={this.toggleWizard} />
        </div>
        {userStore._isTermsAccepted() && (whatsNewPopOver || this.showWhatsNewPopover) && (
          <div className='whats-new-keynotes'>
            <WhatsNew hide={this.hideWhatsNew} changeRoute={this.navigate} />
          </div>
        )}
      </span>
    );
  }
}

Main.wrappedComponent.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default withRouter(Main);
