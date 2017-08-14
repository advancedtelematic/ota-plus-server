import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import { observe, observable, extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { 
    DevicesStore,
    HardwareStore,
    GroupsStore,
    PackagesStore,
    CampaignsStore,
    ImpactAnalysisStore,
    FeaturesStore,
    ProvisioningStore,
    UserStore
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
    @observable initialDevicesCount = null;
    @observable onlineDevicesCount = null;
    @observable router = null;
    @observable systemReady = false;
    @observable pagesWithRedirectToWelcome = ['page-welcome', 'page-destiny'];
    @observable pagesWithWhiteBackground = ['welcome', 'destiny', 'fireworks', 'device'];
    @observable numOfWizards = 0;
    @observable campaignIdToAction = null;
    @observable wizards = [];    
    @observable minimizedWizards = [];
    @observable uploadBoxMinimized = false;

    constructor(props) {
        super(props);
        axios.defaults.headers.common['Csrf-Token'] = document.getElementById('csrf-token-val').value;
        axios.interceptors.response.use(null, (error) => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                this.ifLogout = true;
            }
            return Promise.reject(error);
        });
        this.locationHasChanged = this.locationHasChanged.bind(this);
        this.setSystemReady = this.setSystemReady.bind(this);
        this.makeBodyWhite = this.makeBodyWhite.bind(this);
        this.backButtonAction = this.backButtonAction.bind(this);
        this.addNewWizard = this.addNewWizard.bind(this);
        this.hideWizard = this.hideWizard.bind(this);
        this.toggleWizard = this.toggleWizard.bind(this);
        this.toggleUploadBoxMode = this.toggleUploadBoxMode.bind(this);
        this.sanityCheckCompleted = this.sanityCheckCompleted.bind(this);
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
            campaignsStore: this.campaignsStore
        });
        this.logoutHandler = observe(this.userStore, (change) => {
            if(change.name === 'ifLogout' && change.object[change.name]) {
                this.ifLogout = true;
            }
        });
        this.devicesHandler = observe(this.devicesStore, (change) => {
            if(change.name === 'devicesInitialFetchAsync' && change.object[change.name].isFetching === false) {
                this.initialDevicesCount = this.devicesStore.initialDevices.length;
                let onlineDevices = this.devicesStore.onlineDevices;
                let onlineDevicesCount = onlineDevices.length;
                this.onlineDevicesCount = onlineDevicesCount;
            }
        });
        this.makeBodyWhite();
    }
    componentWillMount() {
        this.router = this.context.router;
        this.router.listen(this.locationHasChanged);
        this.userStore.fetchUser();
        this.devicesStore.fetchInitialDevices();
        this.devicesStore.fetchDevices();
        this.websocketHandler.init();
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
        this.campaignIdToAction = campaignId;
        this.wizards.push(
            <CampaignsWizard
                campaignsStore={this.campaignsStore}
                packagesStore={this.packagesStore}
                groupsStore={this.groupsStore}
                hardwareStore={this.hardwareStore}
                campaignId={this.campaignIdToAction}
                wizardIdentifier={this.wizards.length}
                hideWizard={this.hideWizard}
                toggleWizard={this.toggleWizard}
                minimizedWizards={this.minimizedWizards}
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
    toggleUploadBoxMode() {
        this.uploadBoxMinimized = !this.uploadBoxMinimized;
    }
    locationHasChanged() {
        this.makeBodyWhite();
    }
    setSystemReady(value) {
        this.systemReady = value;
    }
    sanityCheckCompleted() {
        return this.systemReady || Cookies.get('systemReady') == 1;
    }
    makeBodyWhite() {
        let pageName = this.props.location.pathname.toLowerCase().split('/')[1];
        if(_.includes(this.pagesWithWhiteBackground, pageName)) {
            document.body.className = "whitened";
        } else {
            document.body.classList.remove("whitened");
        }
    }
    componentWillUnmount() {
        this.logoutHandler();
        this.devicesHandler();
        this.provisioningStatusHandler();
    }
    backButtonAction() {
        window.history.go(-1);
    }    
    render() {
        const { children, ...rest } = this.props;
        const pageId = "page-" + (this.props.location.pathname.toLowerCase().split('/')[1] || "home");
        let logoLink = '/';
        if(_.includes(this.pagesWithRedirectToWelcome, pageId)) {
            logoLink = '/welcome';
        }        
        return (
            <div id={pageId}>
                <FadeAnimation>
                    {!this.initialDevicesCount ?
                        <IntroNavigation
                            userStore={this.userStore}
                            featuresStore={this.featuresStore}
                            devicesStore={this.devicesStore}
                            logoLink={logoLink}
                        />
                    : this.sanityCheckCompleted() ?
                            <Navigation
                                userStore={this.userStore}
                                featuresStore={this.featuresStore}
                                devicesStore={this.devicesStore}
                            />
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
                        initialDevicesCount={this.initialDevicesCount}
                        onlineDevicesCount={this.onlineDevicesCount}
                        router={this.router}
                        backButtonAction={this.backButtonAction}
                        systemReady={this.systemReady}
                        setSystemReady={this.setSystemReady}
                        addNewWizard={this.addNewWizard}
                    />
                </FadeAnimation>
                <SizeVerify 
                    minWidth={1280}
                    minHeight={768}
                />
                {!this.uploadBoxMinimized ? 
                    <UploadBox 
                        packagesStore={this.packagesStore}
                        minimized={this.uploadBoxMinimized}
                        toggleUploadBoxMode={this.toggleUploadBoxMode}
                    />
                : 
                    null 
                }
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
                        <div className="minimized-box">
                            <UploadBox 
                                packagesStore={this.packagesStore}
                                minimized={this.uploadBoxMinimized}
                                toggleUploadBoxMode={this.toggleUploadBoxMode}
                            />
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
                                    <a href="#" className="box-toggle box-maximize" title="Maximize wizard" onClick={this.toggleWizard.bind(this, wizard.id, wizard.name)}>
                                        <span className="line"></span>
                                    </a>
                                    <a href="#" className="box-toggle box-hide" title="Hide wizard" onClick={this.hideWizard.bind(this, wizard.id)}>
                                        <i className="fa fa-times" aria-hidden="true"></i>
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
    router: React.PropTypes.object.isRequired,
}

Main.propTypes = {
    children: PropTypes.object.isRequired
}

export default Main;
