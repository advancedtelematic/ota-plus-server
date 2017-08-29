import React, { Component, PropTypes } from 'react';
import { observe, observable } from 'mobx';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { Header } from '../partials';
import { HomeContainer, PreparationContainer } from '../containers';
import Cookies from 'js-cookie';

const title = "Home";

@observer
class Home extends Component {
    @observable router = null;

    constructor(props) {
        super(props);
        this.redirectTo = this.redirectTo.bind(this);
        this.sanityCheckCompleted = this.sanityCheckCompleted.bind(this);
    }
    componentWillMount() {
        this.props.devicesStore.fetchDevices();
        this.props.packagesStore.fetchPackages();
        this.props.campaignsStore.fetchCampaigns();
        this.props.campaignsStore.fetchLegacyCampaigns();
        this.props.groupsStore.fetchGroups();
    }
    componentWillUnmount() {
        this.props.devicesStore._reset();
        this.props.packagesStore._reset();
        this.props.campaignsStore._reset();
        this.props.groupsStore._reset();
    }
    sanityCheckCompleted() {
        return this.props.systemReady || Cookies.get('systemReady') == 1;
    }
    componentWillReceiveProps(nextProps) {
        if(this.sanityCheckCompleted()) {            
            this.router = nextProps.router;
            let initialDevicesCount = nextProps.initialDevicesCount;
            let onlineDevicesCount = nextProps.onlineDevicesCount;

            if(initialDevicesCount === 0 && !this.router.isActive('/welcome') && !this.router.isActive('/destiny') && Cookies.get('welcomePageAcknowledged') != 1) {
                this.redirectTo('welcome');
            }
            if(initialDevicesCount === 0 && !this.router.isActive('/welcome') && !this.router.isActive('/destiny') && Cookies.get('welcomePageAcknowledged') == 1) {
                this.redirectTo('destiny');
            }
            if(onlineDevicesCount === 1 && Cookies.get('fireworksPageAcknowledged') != 1            
                && !this.router.isActive('/welcome') && !this.router.isActive('/destiny') 
                && !this.router.isActive('/fireworks')) {
                    this.redirectTo('fireworks');
            }
        }
    }
    redirectTo(page, query = null) {
        if(query) {
            this.router.push('/' + page + query);
        } else {
            this.router.push('/' + page);
        }
    }
    render() {
        const { devicesStore, packagesStore, campaignsStore, groupsStore, hardwareStore, userStore, provisioningStore, featuresStore, setSystemReady, addNewWizard, goToCampaignDetails } = this.props;
        return (
            <FadeAnimation
                display="flex">
                {this.sanityCheckCompleted() ?
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
                                    hardwareStore={hardwareStore}
                                    addNewWizard={addNewWizard}
                                    goToCampaignDetails={goToCampaignDetails}
                                />
                            </MetaData>
                        </div>
                    :
                    <PreparationContainer
                        packagesStore={packagesStore}
                        userStore={userStore}
                        provisioningStore={provisioningStore}
                        featuresStore={featuresStore}
                        setSystemReady={setSystemReady}
                    />
                }
            </FadeAnimation>
        );
    }
}

Home.contextTypes = {
    router: React.PropTypes.object.isRequired
}

Home.propTypes = {
    devicesStore: PropTypes.object,
    hardwareStore: PropTypes.object,
    groupsStore: PropTypes.object,
    packagesStore: PropTypes.object,
    campaignsStore: PropTypes.object,
    userStore: PropTypes.object,
    provisioningStore: PropTypes.object,
    featuresStore: PropTypes.object,

}

export default Home;