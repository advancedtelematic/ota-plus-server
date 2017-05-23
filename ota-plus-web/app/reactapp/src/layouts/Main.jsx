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
    @observable router = null;

    constructor(props) {
        super(props);
        axios.defaults.headers.common['Csrf-Token'] = document.getElementById('csrf-token-val').value;
        axios.interceptors.response.use(null, (error) => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                this.ifLogout = true;
            }
            return Promise.reject(error);
        });
        this.devicesStore = new DevicesStore();
        this.hardwareStore = new HardwareStore();
        this.groupsStore = new GroupsStore();
        this.packagesStore = new PackagesStore();
        this.campaignsStore = new CampaignsStore();
        this.impactAnalysisStore = new ImpactAnalysisStore();
        this.featuresStore = new FeaturesStore();
        this.provisioningStore = new ProvisioningStore();
        this.userStore = new UserStore();
        this.redirectTo = this.redirectTo.bind(this);
        this.websocketHandler = new WebsocketHandler({
            devicesStore: this.devicesStore,
            packagesStore: this.packagesStore,
            welcomePageAcknowledged: Cookies.get('welcomePageAcknowledged') == 1
        });
        this.logoutHandler = observe(this.userStore, (change) => {
            if(change.name === 'ifLogout' && change.object[change.name]) {
                this.ifLogout = true;
            }
        });

        this.locationHasChanged = this.locationHasChanged.bind(this);
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
    }
    componentWillMount() {
        this.router = this.context.router;
        this.userStore.fetchUser();
        this.featuresStore.fetchFeatures();
        this.devicesStore.fetchInitialDevices();
        this.devicesStore.fetchDevices();
        this.websocketHandler.init();
    }
    componentDidMount() {
        this.router.listen(this.locationHasChanged);
    }
    locationHasChanged() {
        // TODO - refactor
        if(!this.router.isActive('/profile/edit') && !this.router.isActive('/profile/usage') && !this.router.isActive('/profile/billing') && !this.router.isActive('/profile/access-keys')
            && !this.props.location.pathname.includes("/device")) {
            if(this.initialDevicesCount === 0 && !this.router.isActive('/welcome') && !this.router.isActive('/destiny') && Cookies.get('welcomePageAcknowledged') != 1) {
                this.redirectTo('welcome');
            }
            if(this.initialDevicesCount === 0 && !this.router.isActive('/welcome') && !this.router.isActive('/destiny') && Cookies.get('welcomePageAcknowledged') == 1) {
                this.redirectTo('destiny');
            }
            if(this.onlineDevicesCount === 1 && Cookies.get('welcomePageAcknowledged') != 1
                && this.deviceInstallationQueue.length === 0 && this.deviceInstallationHistory.length === 0
                && !this.router.isActive('/welcome') && !this.router.isActive('/destiny') 
                && !this.router.isActive('/fireworks')) {
                    this.redirectTo('fireworks');
            }
            if(this.initialDevicesCount !== 0 && (this.router.isActive('/welcome') || this.router.isActive('/destiny'))) {
                this.redirectTo(null);
            }
        }
        
    }
    redirectTo(page) {
        if(!page) {
            this.router.push('/');
        } else {
            this.router.push('/' + page);
        }
    }
    componentWillUnmount() {
        this.logoutHandler();
        this.devicesHandler();
        this.packagesQueueHandler();
        this.packagesHistoryHandler();
    }
    render() {
        const { children, ...rest } = this.props;
        const pageId = "page-" + (this.props.location.pathname.toLowerCase().split('/')[1] || "home");
        return (
            <DragDropContextProvider backend={HTML5Backend}>
            <div id={pageId}>
                <FadeAnimation>
                    {this.router.isActive('/welcome') || this.router.isActive('/destiny') ?
                        <IntroNavigation
                            userStore={this.userStore}
                            featuresStore={this.featuresStore}
                            devicesStore={this.devicesStore}
                            logoLink={'/welcome'}
                        />
                    : this.router.isActive('/fireworks') ?
                        <IntroNavigation
                            userStore={this.userStore}
                            featuresStore={this.featuresStore}
                            devicesStore={this.devicesStore}
                            logoLink={'/'}
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
