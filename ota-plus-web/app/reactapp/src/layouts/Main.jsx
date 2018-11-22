import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import { observe, observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';

import {
    FadeAnimation,
    WebsocketHandler,
} from '../utils';
import { doLogout } from '../utils/Common';
import {
    VIEWPORT_MIN_WIDTH,
    VIEWPORT_MIN_HEIGHT,
} from "../config";
import {
    Navigation,
    SizeVerify,
    UploadBox,
} from '../partials';

import Wizard from '../components/campaigns/Wizard';
import { Minimized } from '../components/minimized';
import { WhatsNewPopover } from "../components/whatsnew";

@inject('stores')
@observer
class Main extends Component {
    @observable wizards = [];
    @observable minimizedWizards = [];
    @observable uploadBoxMinimized = false;
    @observable uiAutoFeatureActivation = document.getElementById('toggle-autoFeatureActivation').value === "true";
    @observable uiUserProfileMenu = document.getElementById('toggle-userProfileMenu').value === "true";
    @observable uiUserProfileEdit = document.getElementById('toggle-userProfileEdit').value === "true";
    @observable uiCredentialsDownload = document.getElementById('toggle-credentialsDownload').value === "true";
    @observable atsGarageTheme = document.getElementById('toggle-atsGarageTheme').value === 'true';
    @observable showWhatsNewPopover = false;
    @observable activeTab = {
        campaigns: 'prepared',
        packages: 'compact',
    };

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
        this.toggleUploadBoxMode = this.toggleUploadBoxMode.bind(this);
        this.callFakeWsHandler = this.callFakeWsHandler.bind(this);
        this.toggleSWRepo = this.toggleSWRepo.bind(this);
        this.locationChange = this.locationChange.bind(this);
        this.addNewWizard = this.addNewWizard.bind(this);
        this.hideWizard = this.hideWizard.bind(this);
        this.toggleWizard = this.toggleWizard.bind(this);
        const {
            devicesStore,
            packagesStore,
            hardwareStore,
            campaignsStore,
            groupsStore,
            userStore
        } = props.stores;
        this.websocketHandler = new WebsocketHandler(document.getElementById('ws-url').value, {
            devicesStore: devicesStore,
            packagesStore: packagesStore,
            hardwareStore: hardwareStore,
            campaignsStore: campaignsStore,
            groupsStore: groupsStore,
        });
        this.logoutHandler = observe(userStore, (change) => {
            if (change.name === 'ifLogout' && change.object[change.name]) {
                this.callFakeWsHandler();
                doLogout();
            }
        });
    }

    toggleWizard(wizardId, wizardName, e) {
        if (e) e.preventDefault();
        const {
            packagesStore,
        } = this.props.stores;
        let minimizedWizard = {
            id: wizardId,
            name: wizardName
        };
        let wizardAlreadyMinimized = _.find(this.minimizedWizards, { id: wizardId });
        if (wizardAlreadyMinimized) {
            this.minimizedWizards.splice(_.findIndex(this.minimizedWizards, { id: wizardId }), 1);
            packagesStore.fetchPackages('packagesSafeFetchAsync');
        }
        else
            this.minimizedWizards.push(minimizedWizard);
    }

    addNewWizard(skipStep = null) {
        const wizard =
            <Wizard
                location={ this.currentLocation() }
                wizardIdentifier={ this.wizards.length }
                hideWizard={ this.hideWizard }
                toggleWizard={ this.toggleWizard }
                minimizedWizards={ this.minimizedWizards }
                skipStep={ skipStep }
                key={ this.wizards.length }
                activeTab={ this.getActiveTab() }
                switchTab={ this.switchTab }
            />;
        this.wizards = this.wizards.concat(wizard);
    }

    hideWizard(wizardIdentifier, e) {
        const {
            campaignsStore
        } = this.props.stores;
        if (e) e.preventDefault();
        this.wizards = _.filter(this.wizards, wizard => parseInt(wizard.key, 10) !== parseInt(wizardIdentifier, 10));
        this.minimizedWizards.splice(_.findIndex(this.minimizedWizards, { id: wizardIdentifier }), 1);
        campaignsStore._resetFullScreen();
    }

    callFakeWsHandler() {
        const {
            devicesStore,
            packagesStore,
            hardwareStore,
            campaignsStore,
            groupsStore
        } = this.props.stores;
        let wsUrl = document.getElementById('ws-url').value.replace('bearer', 'logout');
        this.fakeWebsocketHandler = new WebsocketHandler(wsUrl, {
            devicesStore: devicesStore,
            packagesStore: packagesStore,
            hardwareStore: hardwareStore,
            campaignsStore: campaignsStore,
            groupsStore: groupsStore,
        });
        this.fakeWebsocketHandler.init();
    }

    componentWillMount() {
        const {
            userStore,
            featuresStore,
        } = this.props.stores;
        if (this.uiUserProfileMenu) {
            userStore.fetchUser();
            userStore.fetchContracts();
            featuresStore.fetchFeatures();
        }
        this.websocketHandler.init();
        window.atsGarageTheme = this.atsGarageTheme;
        this.context.router.listen(this.locationChange);
        featuresStore.checkWhatsNewStatus();
    }

    locationChange() {
        const {
            userStore,
        } = this.props.stores;
        if (!userStore._isTermsAccepted() && !this.context.router.isActive('/')) {
            this.context.router.push('/');
        }
        this.updateCampaignsView();
    }

    updateCampaignsView = () => {
        const { campaignsStore } = this.props.stores;
        if (this.currentLocation() === 'campaigns' &&
            !campaignsStore.campaignsFetchAsync[this.getActiveTab()].isFetching) {
            campaignsStore.fetchStatusCounts();
            campaignsStore.fetchCampaigns(this.getActiveTab());
        }
    };

    toggleUploadBoxMode(e) {
        if (e) e.preventDefault();
        this.uploadBoxMinimized = !this.uploadBoxMinimized;
    }

    toggleSWRepo() {
        this.switchToSWRepo = !this.switchToSWRepo;
    }

    componentWillUnmount() {
        this.logoutHandler();
    }

    showWhatsNew = () => {
        this.showWhatsNewPopover = true;
    };

    hideWhatsNew = () => {
        this.showWhatsNewPopover = false;
    };

    navigate = (path) => {
        this.context.router.push(path);
    };

    switchTab = (identifier) => {
        const location = this.currentLocation();
        this.activeTab[location] = identifier;
        this.switchToSWRepo = (this.activeTab[location] === 'advanced');
        this.updateCampaignsView();
    };

    currentLocation = () => {
        return this.props.location.pathname.toLowerCase().split('/')[1];
    };

    getActiveTab = () => {
        const location = this.currentLocation();
        const locationHasTabs = (location === 'packages' || location === 'campaigns');
        if (locationHasTabs) {
            return this.activeTab[location];
        } else {
            return '';
        }
    };

    calcHeight = () => {
        const currentLocation = this.currentLocation();
        if (currentLocation === 'campaigns') {
            return 'calc(100vh - 100px)';
        } else {
            return 'calc(100vh - 50px)';
        }
    };

    render() {
        const { children, ...rest } = this.props;
        const pageId = "page-" + (this.currentLocation() || "home");
        const { userStore, featuresStore } = this.props.stores;
        const { alphaPlusEnabled, whatsNewPopOver } =featuresStore;
        const activeTab = this.getActiveTab();
        return (
            <span>
                <Navigation
                    location={ pageId }
                    toggleSWRepo={ this.toggleSWRepo }
                    uiUserProfileEdit={ this.uiUserProfileEdit }
                    switchToSWRepo={ this.switchToSWRepo }
                    uiUserProfileMenu={ this.uiUserProfileMenu }
                    uiCredentialsDownload={ this.uiCredentialsDownload }
                    alphaPlusEnabled={ alphaPlusEnabled }
                    startWhatsNewPopover={ this.showWhatsNew }
                    switchTab={ this.switchTab }
                    activeTab={ activeTab }
                />
                <div id={ pageId } style={ {
                    height: this.calcHeight(),
                    padding: !alphaPlusEnabled && pageId === 'page-packages' ? '30px' : ''
                } }>
                    <FadeAnimation>
                        <children.type
                            { ...rest }
                            children={ children.props.children }
                            addNewWizard={ this.addNewWizard }
                            uiUserProfileEdit={ this.uiUserProfileEdit }
                            switchToSWRepo={ this.switchToSWRepo }
                            uiAutoFeatureActivation={ this.uiAutoFeatureActivation }
                            uiUserProfileMenu={ this.uiUserProfileMenu }
                            uiCredentialsDownload={ this.uiCredentialsDownload }
                            activeTab={ activeTab }
                            switchTab={ this.switchTab }
                        />
                    </FadeAnimation>
                    <SizeVerify
                        minWidth={ VIEWPORT_MIN_WIDTH }
                        minHeight={ VIEWPORT_MIN_HEIGHT }
                    />
                    <UploadBox
                        minimized={ this.uploadBoxMinimized }
                        toggleUploadBoxMode={ this.toggleUploadBoxMode }
                    />
                    { this.wizards }
                    <Minimized
                        uploadBoxMinimized={ this.uploadBoxMinimized }
                        toggleUploadBoxMode={ this.toggleUploadBoxMode }
                        minimizedWizards={ this.minimizedWizards }
                        toggleWizard={ this.toggleWizard }
                    />
                </div>
                {
                    (userStore._isTermsAccepted() && (whatsNewPopOver || this.showWhatsNewPopover)) &&
                    <div className="whats-new-keynotes">
                        <WhatsNewPopover
                            hide={ this.hideWhatsNew }
                            changeRoute={ this.navigate }
                        />
                    </div>
                }
            </span>
        );
    }
}

Main.wrappedComponent.contextTypes = {
    router: React.PropTypes.object.isRequired,
};

Main.propTypes = {
    children: PropTypes.object.isRequired,
};

export default Main;