import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import { observe, observable, extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
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

@observer
class Main extends Component {
    @observable ifLogout = false;
    @observable initialDevicesCount = null;
    @observable onlineDevicesCount = null;
    @observable deviceInstallationHistory = [];
    @observable deviceInstallationQueue = [];
    @observable provisioningActivated = null;
    @observable treehubActivated = null;
    @observable router = null;
    @observable pagesWithRedirectToWelcome = ['page-welcome', 'page-destiny'];
    @observable pagesWithWhiteBackground = ['welcome', 'destiny', 'fireworks', 'device'];

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
        this.makeBodyWhite = this.makeBodyWhite.bind(this);
        this.devicesStore = new DevicesStore();
        this.hardwareStore = new HardwareStore();
        this.groupsStore = new GroupsStore();
        this.packagesStore = new PackagesStore();
        this.campaignsStore = new CampaignsStore();
        this.impactAnalysisStore = new ImpactAnalysisStore();
        this.featuresStore = new FeaturesStore();
        this.provisioningStore = new ProvisioningStore();
        this.userStore = new UserStore();
        this.websocketHandler = new WebsocketHandler({
            devicesStore: this.devicesStore,
            packagesStore: this.packagesStore,
            hardwareStore: this.hardwareStore,
            campaignsStore: this.campaignsStore,
            fireworksPageAcknowledged: Cookies.get('fireworksPageAcknowledged') == 1
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

                if(onlineDevicesCount === 1) {
                    let device = _.head(onlineDevices);
                    this.packagesStore.fetchDevicePackagesQueue(device.uuid);
                    this.packagesStore.fetchDevicePackagesHistory(device.uuid);
                }
            }
        });
        this.packagesQueueHandler = observe(this.packagesStore, (change) => {
            if(change.name === 'packagesDeviceQueueFetchAsync' && change.object[change.name].isFetching === false) {
                this.deviceInstallationQueue = this.packagesStore.deviceQueue;
            }
        });
        this.packagesHistoryHandler = observe(this.packagesStore, (change) => {
            if(change.name === 'packagesDeviceHistoryFetchAsync' && change.object[change.name].isFetching === false) {
                this.deviceInstallationHistory = this.packagesStore.deviceHistory;
            }
        });
        this.provisioningStatusHandler = observe(this.provisioningStore, (change) => {
            if(change.name === 'provisioningStatusFetchAsync' && change.object[change.name].isFetching === false) {
                this.provisioningActivated = this.provisioningStore.provisioningStatus.active;
            }
        });
        this.treehubStatusHandler = observe(this.featuresStore, (change) => {
            if(change.name === 'featuresFetchAsync' && change.object[change.name].isFetching === false) {
                this.treehubActivated = _.includes(this.featuresStore.features, "treehub");
            }
        });
        this.makeBodyWhite();
    }
    componentWillMount() {
        this.router = this.context.router;
        this.router.listen(this.locationHasChanged);
        this.userStore.fetchUser();
        this.featuresStore.fetchFeatures();
        this.devicesStore.fetchInitialDevices();
        this.devicesStore.fetchDevices();
        this.provisioningStore.fetchProvisioningStatus();
        this.websocketHandler.init();
    }
    locationHasChanged() {
        this.makeBodyWhite();
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
        this.packagesQueueHandler();
        this.packagesHistoryHandler();
        this.provisioningStatusHandler();
    }
    render() {
        const { children, ...rest } = this.props;
        const pageId = "page-" + (this.props.location.pathname.toLowerCase().split('/')[1] || "home");
        let logoLink = '/';
        if(_.includes(this.pagesWithRedirectToWelcome, pageId)) {
            logoLink = '/welcome';
        }
        return (
            <DragDropContextProvider backend={HTML5Backend}>
            <div id={pageId}>
                <FadeAnimation>
                    {!this.initialDevicesCount ?
                        <IntroNavigation
                            userStore={this.userStore}
                            featuresStore={this.featuresStore}
                            devicesStore={this.devicesStore}
                            logoLink={logoLink}
                        />
                    :
                        <Navigation
                            userStore={this.userStore}
                            featuresStore={this.featuresStore}
                            devicesStore={this.devicesStore}
                        />
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
                        deviceInstallationHistory={this.deviceInstallationHistory}
                        deviceInstallationQueue={this.deviceInstallationQueue}
                        provisioningActivated={this.provisioningActivated}
                        treehubActivated={this.treehubActivated}
                        router={this.router}
                    />
                </FadeAnimation>
                <SizeVerify 
                    minWidth={1280}
                    minHeight={768}
                />
                <UploadBox 
                    packagesStore={this.packagesStore}
                />
                <DoorAnimation
                    mode="show"
                />
                {this.ifLogout ?
                    <DoorAnimation 
                        mode="hide"
                    />
                :
                    null
                }
            </div>
            </DragDropContextProvider>
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
