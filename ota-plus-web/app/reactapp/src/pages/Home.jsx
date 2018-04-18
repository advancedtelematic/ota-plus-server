import React, { Component, PropTypes } from 'react';
import { observe, observable } from 'mobx';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { HomeContainer, PreparationContainer } from '../containers';
import Cookies from 'js-cookie';

const title = "Home";

@observer
class Home extends Component {

    constructor(props) {
        super(props);
        this.sanityCheckCompleted = this.sanityCheckCompleted.bind(this);
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
    sanityCheckCompleted() {
        if (!this.props.uiAutoFeatureActivation) {
            return true;
        } else {
            return this.props.systemReady || Cookies.get('systemReady') == 1;
        }
    }
    render() {
        const { devicesStore, packagesStore, campaignsStore, hardwareStore, userStore, provisioningStore, featuresStore, setSystemReady, addNewWizard, uiUserProfileMenu } = this.props;
        return (
            <FadeAnimation
                display="flex">
                {this.sanityCheckCompleted() ?
                    <MetaData
                        title={title}>
                        <HomeContainer
                            devicesStore={devicesStore}
                            packagesStore={packagesStore}
                            campaignsStore={campaignsStore}
                            hardwareStore={hardwareStore}
                            addNewWizard={addNewWizard}
                        />
                    </MetaData>
                :
                    <PreparationContainer
                        packagesStore={packagesStore}
                        userStore={userStore}
                        provisioningStore={provisioningStore}
                        featuresStore={featuresStore}
                        setSystemReady={setSystemReady}
                        uiUserProfileMenu={uiUserProfileMenu}
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
    packagesStore: PropTypes.object,
    campaignsStore: PropTypes.object,
    userStore: PropTypes.object,
    provisioningStore: PropTypes.object,
    featuresStore: PropTypes.object,

}

export default Home;