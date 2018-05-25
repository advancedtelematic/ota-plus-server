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
} from '../stores';
import { APP_LAYOUT } from '../config';
import { 
    Navigation,
    SizeVerify,
    UploadBox 
} from '../partials';
import { 
    FadeAnimation, 
    WebsocketHandler,
} from '../utils';
import _ from 'underscore';
import Cookies from 'js-cookie';
import { CampaignsWizard } from '../components/campaigns';
import { doLogout } from '../utils/Common';
import * as contracts from '../../../assets/contracts/';

@observer
class Main extends Component {
    @observable systemReady = false;
    @observable termsAndConditionsAccepted = false;
    @observable numOfWizards = 0;
    @observable wizards = [];    
    @observable minimizedWizards = [];
    @observable uploadBoxMinimized = false;
    @observable uiAutoFeatureActivation = document.getElementById('toggle-autoFeatureActivation').value === "true";
    @observable uiUserProfileMenu = document.getElementById('toggle-userProfileMenu').value === "true";
    @observable uiUserProfileEdit = document.getElementById('toggle-userProfileEdit').value === "true";
    @observable uiCredentialsDownload = document.getElementById('toggle-credentialsDownload').value === "true";
    @observable atsGarageTheme = document.getElementById('toggle-atsGarageTheme').value === 'true';
    @observable switchToSWRepo = false;

    constructor(props) {
        super(props);
        axios.defaults.headers.common['Csrf-Token'] = document.getElementById('csrf-token-val').value;
        axios.interceptors.response.use(null, (error) => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                this.callFakeWsHandler();
                doLogout();
            }
            return Promise.reject(error);
        });
        this.setSystemReady = this.setSystemReady.bind(this);
        this.setTermsAccepted = this.setTermsAccepted.bind(this);
        this.termsAccepted = this.termsAccepted.bind(this);
        this.backButtonAction = this.backButtonAction.bind(this);
        this.addNewWizard = this.addNewWizard.bind(this);
        this.hideWizard = this.hideWizard.bind(this);
        this.toggleWizard = this.toggleWizard.bind(this);
        this.toggleUploadBoxMode = this.toggleUploadBoxMode.bind(this);
        this.sanityCheckCompleted = this.sanityCheckCompleted.bind(this);
        
        this.callFakeWsHandler = this.callFakeWsHandler.bind(this);
        this.toggleSWRepo = this.toggleSWRepo.bind(this);
        this.toggleFleet = this.toggleFleet.bind(this);
        this.locationChange = this.locationChange.bind(this);
        this.devicesStore = new DevicesStore();
        this.hardwareStore = new HardwareStore();
        this.groupsStore = new GroupsStore();
        this.packagesStore = new PackagesStore();
        this.campaignsStore = new CampaignsStore();
        this.impactAnalysisStore = new ImpactAnalysisStore();
        this.featuresStore = new FeaturesStore();
        this.provisioningStore = new ProvisioningStore();
        this.userStore = new UserStore();
        this.websocketHandler = new WebsocketHandler(document.getElementById('ws-url').value, {
            devicesStore: this.devicesStore,
            packagesStore: this.packagesStore,
            hardwareStore: this.hardwareStore,
            campaignsStore: this.campaignsStore,
            groupsStore: this.groupsStore,
        });
        this.logoutHandler = observe(this.userStore, (change) => {
            if(change.name === 'ifLogout' && change.object[change.name]) {
                this.callFakeWsHandler();
                doLogout();
            }
        });
    }
    callFakeWsHandler() {
        let wsUrl = document.getElementById('ws-url').value.replace('bearer', 'logout');
        this.fakeWebsocketHandler = new WebsocketHandler(wsUrl, {
            devicesStore: this.devicesStore,
            packagesStore: this.packagesStore,
            hardwareStore: this.hardwareStore,
            campaignsStore: this.campaignsStore,
            groupsStore: this.groupsStore,
        });
        this.fakeWebsocketHandler.init();
    }
    componentWillMount() {
        if(this.uiUserProfileMenu) {
            this.userStore.fetchUser();
            this.featuresStore.fetchFeatures();
            this.userStore.fetchContracts();
        }
        this.devicesStore.fetchDevices();
        this.devicesStore.fetchDevicesCount();
        this.websocketHandler.init();
        window.atsGarageTheme = this.atsGarageTheme;
        this.context.router.listen(this.locationChange);
    }
    locationChange() {
        if(!this.termsAccepted() && !this.context.router.isActive('/')) {
            this.context.router.push('/');
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
    addNewWizard(campaignId = null, e) {
        if(e) e.preventDefault();
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
                alphaPlusEnabled={this.featuresStore.alphaPlusEnabled}
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
        this.campaignsStore._resetFullScreen();
    }
    toggleUploadBoxMode(e) {
        if(e) e.preventDefault();
        this.uploadBoxMinimized = !this.uploadBoxMinimized;
    }
    toggleSWRepo() {
        this.switchToSWRepo = !this.switchToSWRepo;
    }
    setSystemReady() {
        this.systemReady = true;
        Cookies.set('systemReady', 1);
    }
    sanityCheckCompleted() {
        if (!this.uiAutoFeatureActivation) {
            return true;
        } else {
            return this.systemReady || Cookies.get('systemReady') == 1;
        }
    }
    setTermsAccepted(path) {
        this.userStore.acceptContract(path);
    }
    termsAccepted() {
        const terms = _.find(this.userStore.contracts, (obj) => contracts.default[obj.contract]);
        return terms && terms.accepted ? this.termsAndConditionsAccepted = true : null;
    }
    componentWillUnmount() {
        this.logoutHandler();
    }
    backButtonAction(e) {
        if(e) e.preventDefault();
        window.history.go(-1);
    }
    toggleFleet(fleet, e) {
        if(e) e.preventDefault();
        this.groupsStore.activeFleet = fleet;
        this.groupsStore._filterGroups(fleet.id);
    }
    render() {
        const { children, ...rest } = this.props;
        const pageId = "page-" + (this.props.location.pathname.toLowerCase().split('/')[1] || "home");
        return (
            <span>
                {this.sanityCheckCompleted() ?
                    <Navigation
                        userStore={this.userStore}
                        devicesStore={this.devicesStore}
                        packagesStore={this.packagesStore}
                        activeFleet={this.groupsStore.activeFleet}
                        location={pageId}
                        toggleSWRepo={this.toggleSWRepo}
                        uiUserProfileEdit={this.uiUserProfileEdit}
                        switchToSWRepo={this.switchToSWRepo}
                        alphaPlusEnabled={this.featuresStore.alphaPlusEnabled}
                        uiUserProfileMenu={this.uiUserProfileMenu}
                        uiCredentialsDownload={this.uiCredentialsDownload}
                        toggleFleet={this.toggleFleet}
                    />
                :
                    pageId === 'page-policy' ?
                        <FadeAnimation>
                            <nav className="navbar navbar-inverse">
                                <div className="container">
                                    <div className="navbar-header">
                                        <div className="navbar-brand" id="logo"/>
                                    </div>
                                </div>
                            </nav>
                        </FadeAnimation>
                    : null
                }
                <div id={pageId} style={{
                    height: this.featuresStore.alphaPlusEnabled && (pageId === 'page-packages' || pageId === 'page-devices') ? 'calc(100vh - 100px)' : 'calc(100vh - 50px)',
                    padding: !this.featuresStore.alphaPlusEnabled && pageId === 'page-packages' ? '30px' : ''
                }}>
                    <FadeAnimation>                    
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
                            backButtonAction={this.backButtonAction}
                            setSystemReady={this.setSystemReady}
                            addNewWizard={this.addNewWizard}
                            uiUserProfileEdit={this.uiUserProfileEdit}
                            switchToSWRepo={this.switchToSWRepo}
                            uiAutoFeatureActivation={this.uiAutoFeatureActivation}
                            uiUserProfileMenu={this.uiUserProfileMenu}
                            uiCredentialsDownload={this.uiCredentialsDownload}
                            alphaPlusEnabled={this.featuresStore.alphaPlusEnabled}
                            sanityCheckCompleted={this.sanityCheckCompleted}
                            setTermsAccepted={this.setTermsAccepted}
                            termsAccepted={this.termsAccepted}
                            toggleFleet={this.toggleFleet}
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
                    {this.wizards}
                    <div className="minimized-wizards-container">
                        {this.uploadBoxMinimized ?
                            <div className="minimized-box" key={this.packagesStore.packagesUploading.length}>
                                <div className="name">
                                    Uploading {this.props.t('common.packageWithCount', {count: this.packagesStore.packagesUploading.length})}
                                </div>
                                <div className="actions">
                                    <a href="#" id="maximize-upload-box" className="box-toggle box-maximize" onClick={this.toggleUploadBoxMode.bind(this)}>
                                        <img src="/assets/img/icons/reopen.svg" alt="Icon" />
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
                                            <img src="/assets/img/icons/reopen.svg" alt="Icon" />
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </span>
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
