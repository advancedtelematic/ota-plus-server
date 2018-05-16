import React, { Component, PropTypes } from 'react';
import { observe, observable } from 'mobx';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { HomeContainer, PreparationContainer, Terms } from '../containers';

const title = "Home";

@observer
class Home extends Component {
    constructor(props) {
        super(props);
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
    render() {
        const { 
            devicesStore,
            packagesStore,
            campaignsStore,
            hardwareStore,
            userStore,
            provisioningStore,
            featuresStore,
            setSystemReady,
            addNewWizard,
            uiUserProfileMenu,
            sanityCheckCompleted,
            setTermsAccepted,
            termsAccepted
        } = this.props;
        return (
            <FadeAnimation
                display="flex">
                {termsAccepted() ?
                    sanityCheckCompleted() ?
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
                : 
                    <Terms
                        userStore={userStore}
                        setTermsAccepted={setTermsAccepted}
                    />
                }
            </FadeAnimation>
        );
    }
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