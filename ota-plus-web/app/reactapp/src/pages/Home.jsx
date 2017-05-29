import React, { Component, PropTypes } from 'react';
import { observe, observable } from 'mobx';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { Header } from '../partials';
import { HomeContainer } from '../containers';
import Cookies from 'js-cookie';

const title = "Home";

@observer
class Home extends Component {
    @observable router = null;

    constructor(props) {
        super(props);
        this.redirectTo = this.redirectTo.bind(this);
    }
    componentWillMount() {
        this.props.devicesStore.fetchDevices();
        this.props.packagesStore.fetchPackages();
        this.props.campaignsStore.fetchCampaigns();
    }
    componentWillUnmount() {
        this.props.devicesStore._reset();
        this.props.packagesStore._reset();
        this.props.campaignsStore._reset();
    }
    componentWillReceiveProps(nextProps) {
        this.router = nextProps.router;
        let initialDevicesCount = nextProps.initialDevicesCount;
        let onlineDevicesCount = nextProps.onlineDevicesCount;
        let deviceInstallationHistory = nextProps.deviceInstallationHistory;
        let deviceInstallationQueue = nextProps.deviceInstallationQueue;
        let provisioningActivated = nextProps.provisioningActivated;
        let treehubActivated = nextProps.treehubActivated;

        if(initialDevicesCount === 0 && !this.router.isActive('/welcome') && !this.router.isActive('/destiny') && Cookies.get('welcomePageAcknowledged') != 1) {
            this.redirectTo('welcome');
        }
        if(treehubActivated === false || provisioningActivated === false) {
            this.redirectTo('welcome', '?features=false');
        }
        if(initialDevicesCount === 0 && !this.router.isActive('/welcome') && !this.router.isActive('/destiny') && Cookies.get('welcomePageAcknowledged') == 1) {
            this.redirectTo('destiny');
        }
        if(onlineDevicesCount === 1 && Cookies.get('welcomePageAcknowledged') != 1
            && deviceInstallationQueue.length === 0 && deviceInstallationHistory.length === 0
            && !this.router.isActive('/welcome') && !this.router.isActive('/destiny') 
            && !this.router.isActive('/fireworks')) {
                this.redirectTo('fireworks');
        }
    }
    redirectTo(page, query = null) {
        this.router.push('/' + page + (query ? query : null));
    }
    render() {
        const { devicesStore, packagesStore, campaignsStore, groupsStore } = this.props;
        return (
            <FadeAnimation 
                display="flex">
                <div className="wrapper-flex">
                    <Header 
                        title={title}
                    />
                    <MetaData 
                        title={title}>
                        <HomeContainer
                            devicesStore={devicesStore}
                            packagesStore={packagesStore}
                            campaignsStore={campaignsStore}
                            groupsStore={groupsStore}
                        />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

Home.contextTypes = {
    router: React.PropTypes.object.isRequired
}

Home.propTypes = {
    devicesStore: PropTypes.object,
    packagesStore: PropTypes.object,
    campaignsStore: PropTypes.object,
    groupsStore: PropTypes.object
}

export default Home;