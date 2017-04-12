import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import { observe, observable } from 'mobx';
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
    SizeVerify,
    UploadBox 
} from '../partials';
import { 
    FadeAnimation, 
    WebsocketHandler,
    DoorAnimation
} from '../utils';

@observer
class Main extends Component {
    @observable ifLogout = false;

    constructor(props) {
        super(props);
        axios.defaults.headers.common['Csrf-Token'] = csrfToken;
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
        this.websocketHandler = new WebsocketHandler({
            devicesStore: this.devicesStore,
            packagesStore: this.packagesStore
        });
        this.logoutHandler = observe(this.userStore, (change) => {
            if(change.name === 'ifLogout' && change.object[change.name]) {
                this.ifLogout = true;
            }
        });
    }
    componentWillMount() {
        this.userStore.fetchUser();
        this.featuresStore.fetchFeatures();
        this.websocketHandler.init();
    }
    componentWillUnmount() {
        this.logoutHandler();
    }
    render() {
        const { children, ...rest } = this.props;
        const pageId = "page-" + (this.props.location.pathname.toLowerCase().split('/')[1] || "home");
        return (
            <DragDropContextProvider backend={HTML5Backend}>
            <div id={pageId}>
                <FadeAnimation>
                    <Navigation
                        userStore={this.userStore}
                        featuresStore={this.featuresStore}
                    />
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
                    />
                </FadeAnimation>
                <SizeVerify />
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

Main.propTypes = {
    children: PropTypes.object.isRequired
}

export default Main;