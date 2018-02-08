import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import { observe, observable, extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { 
    DevicesStore,
    HardwareStore,
    GroupsStore,
    PackagesStore,
    CampaignsStore,
    ImpactAnalysisStore,
    FeaturesStore,
    ProvisioningStore,
    UserStore,
    OtaPlusStore
} from '../stores';
import { APP_LAYOUT } from '../config';
import { 
    Navigation,
    IntroNavigation,
    SizeVerify,
    UploadBox 
} from '../partials';
import { 
    FadeAnimation, 
    WebsocketHandler,
    DoorAnimation
} from '../utils';
import _ from 'underscore';
import Cookies from 'js-cookie';
import { CampaignsWizard } from '../components/campaigns';

@observer
class Main extends Component {
    @observable ifLogout = false;
    @observable directorDevicesCount = null;
    @observable allDevicesCount = null;
    @observable router = null;
    @observable systemReady = false;
    @observable pagesWithRedirectToWelcome = ['page-welcome', 'page-destiny'];
    @observable pagesWithWhiteBackground = ['welcome', 'destiny', 'fireworks', 'device'];
    @observable pagesWithGradientBackground = ['login'];
    @observable pagesWithHiddenNavbar = ['page-login'];
    @observable numOfWizards = 0;
    @observable wizards = [];    
    @observable minimizedWizards = [];
    @observable uploadBoxMinimized = false;
    @observable queueModalShown = false;
    @observable activeTabId = 0;
    @observable uiAutoFeatureActivation = document.getElementById('toggle-autoFeatureActivation').value === "true";
    @observable uiUserProfileMenu = document.getElementById('toggle-userProfileMenu').value === "true";
    @observable uiCredentialsDownload = document.getElementById('toggle-credentialsDownload').value === "true";
    @observable prebuiltDebrpm = document.getElementById('toggle-prebuiltDebrpm').value === "true";
    @observable isLegacyShown = document.getElementById('toggle-legacyCampaigns').value === "true";

    constructor(props) {
        super(props);
        axios.defaults.headers.common['Csrf-Token'] = document.getElementById('csrf-token-val').value;
        axios.interceptors.response.use(null, (error) => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                this.ifLogout = true;
                this.callFakeWsHandler();
            }
            return Promise.reject(error);
        });
        this.locationHasChanged = this.locationHasChanged.bind(this);
        this.setSystemReady = this.setSystemReady.bind(this);
        this.makeBodyWhite = this.makeBodyWhite.bind(this);
        this.makeBodyGradient = this.makeBodyGradient.bind(this);
        this.backButtonAction = this.backButtonAction.bind(this);
        this.addNewWizard = this.addNewWizard.bind(this);
        this.hideWizard = this.hideWizard.bind(this);
        this.toggleWizard = this.toggleWizard.bind(this);
        this.toggleUploadBoxMode = this.toggleUploadBoxMode.bind(this);
        this.sanityCheckCompleted = this.sanityCheckCompleted.bind(this);
        this.showQueueModal = this.showQueueModal.bind(this);
        this.hideQueueModal = this.hideQueueModal.bind(this);
        this.setQueueModalActiveTabId = this.setQueueModalActiveTabId.bind(this);
        this.toggleOtaPlusMode = this.toggleOtaPlusMode.bind(this);
        this.callFakeWsHandler = this.callFakeWsHandler.bind(this);
        this.devicesStore = new DevicesStore();
        this.hardwareStore = new HardwareStore();
        this.groupsStore = new GroupsStore();
        this.packagesStore = new PackagesStore();
        this.campaignsStore = new CampaignsStore();
        this.impactAnalysisStore = new ImpactAnalysisStore();
        this.featuresStore = new FeaturesStore();
        this.provisioningStore = new ProvisioningStore();
        this.userStore = new UserStore();
        this.otaPlusStore = new OtaPlusStore();
        this.websocketHandler = new WebsocketHandler(document.getElementById('ws-url').value, {
            devicesStore: this.devicesStore,
            packagesStore: this.packagesStore,
            hardwareStore: this.hardwareStore,
            campaignsStore: this.campaignsStore
        });
        this.logoutHandler = observe(this.userStore, (change) => {
            if(change.name === 'ifLogout' && change.object[change.name]) {
                this.ifLogout = true;
                this.callFakeWsHandler();
            }
        });
        this.devicesHandler = observe(this.devicesStore, (change) => {
            if(change.name === 'devicesCountFetchAsync' && change.object[change.name].isFetching === false) {
                this.allDevicesCount = this.devicesStore.directorDevicesCount + this.devicesStore.legacyDevicesCount;
                this.directorDevicesCount = this.devicesStore.directorDevicesCount;
            }
        });

        this.featuresHandler = observe(this.featuresStore, (change) => {
            if(change.name === 'featuresFetchAsync' && change.object[change.name].isFetching === false) {
                if(_.contains(this.featuresStore.features, 'alphaplus')) {
                    this.otaPlusStore._enableAlphaPlus();
                }
            }
        });

        this.directorAttributesHandler = observe(this.devicesStore, (change) => {
            if(change.name === 'devicesDirectorAttributesFetchAsync' && change.object[change.name].isFetching === false) {
                let expandedPackage = this.packagesStore.expandedPackage;
                let installed = false;
                if(this.devicesStore.device.isDirector) {
                    if(this.hardwareStore.activeEcu.type === 'primary' && this.devicesStore._getPrimaryFilepath() === expandedPackage.imageName) {
                        installed = true;
                    }
                    if(this.hardwareStore.activeEcu.type === 'secondary') {
                        let serial = this.hardwareStore.activeEcu.serial;
                        if(_.includes(this.devicesStore._getSecondaryHashesBySerial(serial), expandedPackage.imageName)) {
                            installed = true;
                        }
                    }
                }
                expandedPackage.isInstalled = installed;
            }
        });
        this.makeBodyWhite();
        this.makeBodyGradient();
    }
    callFakeWsHandler() {
        let wsUrl = document.getElementById('ws-url').value.replace('bearer', 'logout');
        this.fakeWebsocketHandler = new WebsocketHandler(wsUrl, {
            devicesStore: this.devicesStore,
            packagesStore: this.packagesStore,
            hardwareStore: this.hardwareStore,
            campaignsStore: this.campaignsStore
        });
        this.fakeWebsocketHandler.init();
    }
    componentWillMount() {
        this.router = this.context.router;
        this.router.listen(this.locationHasChanged);
        if(this.uiUserProfileMenu) {
            this.userStore.fetchUser();
            this.featuresStore.fetchFeatures();
        }
        this.devicesStore.fetchDevices();
        this.devicesStore.fetchDevicesCount();
        this.hardwareStore.fetchHardwareIds();
        this.websocketHandler.init();

        if (!this.otaPlusStore.atsGarageTheme) {
            document.body.className += " ota-plus";
            window.atsGarageTheme = false;
        } else {
            window.atsGarageTheme = true;
        }

        if (Cookies.get('otaPlusMode') == 1 ) {
            this.otaPlusStore._enableOtaPlusMode();
            document.body.className += " ota-plus";
            window.otaPlusMode = true;
        }
    }
    toggleOtaPlusMode() {
        this.otaPlusStore._toggleOtaPlusMode();
        if(this.otaPlusStore.otaPlusMode) {
            Cookies.set('otaPlusMode', 1);
            document.body.className += " ota-plus";
            window.otaPlusMode = true;
        }
        else {
            Cookies.remove('otaPlusMode');
            if (this.otaPlusStore.atsGarageTheme) {
                document.body.classList.remove("ota-plus");
            }
            window.otaPlusMode = false;
        }
    }
    showQueueModal() {
        this.queueModalShown = true;
    }
    hideQueueModal() {
        this.queueModalShown = false;
        this.setQueueModalActiveTabId(0);
    }
    setQueueModalActiveTabId(tabId, device = null) {
        this.activeTabId = tabId;
        if(!_.isEmpty(device) && device.isDirector && tabId === 1) {
            this.packagesStore.fetchDirectorDevicePackagesHistory(device.uuid, this.packagesStore.directorDevicePackagesFilter);
        }
    }    
    toggleWizard(wizardId, wizardName, e) {
        if(e) e.preventDefault();
        let minimizedWizard = {
            id: wizardId,
            name: wizardName
        };
        let wizardAlreadyMinimized = _.find(this.minimizedWizards, {id: wizardId});
        if(wizardAlreadyMinimized)
            this.minimizedWizards.splice(_.findIndex(this.minimizedWizards, { id: wizardId }), 1);
        else
            this.minimizedWizards.push(minimizedWizard);
    }
    addNewWizard(campaignId = null) {
        this.wizards.push(
            <CampaignsWizard
                campaignsStore={this.campaignsStore}
                packagesStore={this.packagesStore}
                groupsStore={this.groupsStore}
                hardwareStore={this.hardwareStore}
                wizardIdentifier={this.wizards.length}
                hideWizard={this.hideWizard}
                toggleWizard={this.toggleWizard}
                minimizedWizards={this.minimizedWizards}
                isLegacyShown={this.isLegacyShown}
                alphaPlusEnabled={this.otaPlusStore.alphaPlusEnabled}
                key={this.wizards.length}
            />
        );
    }
    hideWizard(wizardIdentifier, e) {
        if(e) e.preventDefault();
        _.each(this.wizards, (wizard, index) => {
            if(wizard && wizard.key == wizardIdentifier) {
                this.wizards.splice(index, 1);
            }
        })
        this.minimizedWizards.splice(_.findIndex(this.minimizedWizards, { id: wizardIdentifier }), 1);
    }
    toggleUploadBoxMode(e) {
        if(e) e.preventDefault();
        this.uploadBoxMinimized = !this.uploadBoxMinimized;
    }
    locationHasChanged() {
        this.makeBodyWhite();
        this.makeBodyGradient();
    }
    setSystemReady(value) {
        this.systemReady = value;
    }
    sanityCheckCompleted() {
        if (!this.uiAutoFeatureActivation) {
            return true;
        } else {
            return this.systemReady || Cookies.get('systemReady') == 1;
        }
    }
    makeBodyGradient() {
        let pageName = this.props.location.pathname.toLowerCase().split('/')[1];
        if(_.includes(this.pagesWithGradientBackground, pageName)) {
            document.body.className += " gradient";
        } else {
            document.body.classList.remove("gradient");
        }
    }
    makeBodyWhite() {
        let pageName = this.props.location.pathname.toLowerCase().split('/')[1];
        if(_.includes(this.pagesWithWhiteBackground, pageName)) {
            document.body.className += " whitened";
        } else {
            document.body.classList.remove("whitened");
        }
    }
    componentWillUnmount() {
        this.logoutHandler();
        this.devicesHandler();
        this.provisioningStatusHandler();
        this.featuresHandler();
        this.directorAttributesHandler();
    }
    backButtonAction(e) {
        if(e) e.preventDefault();
        window.history.go(-1);
    }
    componentWillReceiveProps(nextProps) {
        if(this.queueModalShown) {
            this.hideQueueModal();
        }
    }
    render() {
        const { children, ...rest } = this.props;
        const pageId = "page-" + (this.props.location.pathname.toLowerCase().split('/')[1] || "home");
        let logoLink = '/';
        if(this.otaPlusStore.otaPlusMode) {
            logoLink = '/dashboard';
        }
        if(_.includes(this.pagesWithRedirectToWelcome, pageId)) {
            logoLink = '/welcome';
        }
        return (
            <div id={pageId}>
                <FadeAnimation>
                    {!_.includes(this.pagesWithHiddenNavbar, pageId) ?
                        !this.allDevicesCount ?
                            <IntroNavigation
                                userStore={this.userStore}
                                featuresStore={this.featuresStore}
                                devicesStore={this.devicesStore}
                                packagesStore={this.packagesStore}
                                allDevicesCount={this.allDevicesCount}
                                logoLink={logoLink}
                                hideQueueModal={this.hideQueueModal}
                                toggleOtaPlusMode={this.toggleOtaPlusMode}
                                otaPlusMode={this.otaPlusStore.otaPlusMode}
                                atsGarageTheme={this.otaPlusStore.atsGarageTheme}
                                alphaPlusEnabled={this.otaPlusStore.alphaPlusEnabled}
                                uiUserProfileMenu={this.uiUserProfileMenu}
                                uiCredentialsDownload={this.uiCredentialsDownload}
                            />
                        : this.sanityCheckCompleted() ?
                                <Navigation
                                    userStore={this.userStore}
                                    featuresStore={this.featuresStore}
                                    devicesStore={this.devicesStore}
                                    packagesStore={this.packagesStore}
                                    hideQueueModal={this.hideQueueModal}
                                    toggleOtaPlusMode={this.toggleOtaPlusMode}
                                    otaPlusMode={this.otaPlusStore.otaPlusMode}
                                    alphaPlusEnabled={this.otaPlusStore.alphaPlusEnabled}
                                    uiUserProfileMenu={this.uiUserProfileMenu}
                                    uiCredentialsDownload={this.uiCredentialsDownload}
                                />
                            :
                                null                        
                    :
                        null
                    }
                    <children.type
                        {...rest}
                        children={children.props.children}
                        devicesStore={this.devicesStore}
                        hardwareStore={this.hardwareStore}
                        groupsStore={this.groupsStore}
                        packagesStore={this.packagesStore}
                        campaignsStore={this.campaignsStore}
                        impactAnalysisStore={this.impactAnalysisStore}
                        featuresStore={this.featuresStore}
                        provisioningStore={this.provisioningStore}
                        userStore={this.userStore}
                        directorDevicesCount={this.directorDevicesCount}
                        allDevicesCount={this.allDevicesCount}
                        router={this.router}
                        backButtonAction={this.backButtonAction}
                        systemReady={this.systemReady}
                        setSystemReady={this.setSystemReady}
                        addNewWizard={this.addNewWizard}
                        showQueueModal={this.showQueueModal}
                        hideQueueModal={this.hideQueueModal}
                        queueModalShown={this.queueModalShown}
                        activeTabId={this.activeTabId}
                        setQueueModalActiveTabId={this.setQueueModalActiveTabId}
                        otaPlusMode={this.otaPlusStore.otaPlusMode}
                        otaPlusStore={this.otaPlusStore}
                        uiAutoFeatureActivation={this.uiAutoFeatureActivation}
                        uiUserProfileMenu={this.uiUserProfileMenu}
                        uiCredentialsDownload={this.uiCredentialsDownload}
                        prebuiltDebrpm={this.prebuiltDebrpm}
                        isLegacyShown={this.isLegacyShown}
                    />
                </FadeAnimation>
                <SizeVerify 
                    minWidth={1280}
                    minHeight={768}
                />
                <UploadBox 
                    packagesStore={this.packagesStore}
                    minimized={this.uploadBoxMinimized}
                    toggleUploadBoxMode={this.toggleUploadBoxMode}
                />
                {this.sanityCheckCompleted() ?
                    <DoorAnimation
                        mode="show"
                    />
                :
                    null
                }
                {this.ifLogout ?
                    <DoorAnimation 
                        mode="hide"
                    />
                :
                    null
                }
                {this.wizards}
                <div className="minimized-wizards-container">
                    {this.uploadBoxMinimized ?
                        <div className="minimized-box" key={this.packagesStore.packagesUploading.length}>
                            <div className="name">
                                Uploading {this.props.t('common.packageWithCount', {count: this.packagesStore.packagesUploading.length})}
                            </div>
                            <div className="actions">
                                <a href="#" id="maximize-upload-box" className="box-toggle box-maximize" onClick={this.toggleUploadBoxMode.bind(this)}>
                                    <i className="fa fa-angle-up" aria-hidden="true"></i>
                                </a>                           
                            </div>
                        </div>
                    :
                        null
                    }
                    {_.map(this.minimizedWizards, (wizard, index) => {
                        return (
                            <div className="minimized-box" key={index}>
                                <div className="name">
                                    {wizard.name ?
                                        <span>
                                            {wizard.name}
                                        </span>
                                    :
                                        <span>
                                            Choose name
                                        </span>
                                    }
                                </div>
                                <div className="actions">
                                    <a href="#" id="maximize-wizard" className="box-toggle box-maximize" title="Maximize wizard" onClick={this.toggleWizard.bind(this, wizard.id, wizard.name)}>
                                        <i className="fa fa-angle-up" aria-hidden="true"></i>
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
    
}

Main.contextTypes = {
    router: React.PropTypes.object.isRequired
}

Main.propTypes = {
    children: PropTypes.object.isRequired
}

export default translate()(Main);
