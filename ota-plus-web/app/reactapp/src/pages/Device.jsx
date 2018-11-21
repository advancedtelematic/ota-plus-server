import React, { Component, PropTypes } from 'react';
import {observable} from 'mobx';
import {observer, inject} from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { DeviceContainer } from '../containers';
import { DeviceSequencerModal } from '../components/device';

const title = "Device";

@inject("stores")
@observer
class Device extends Component {
    @observable sequencerShown = false;

    componentWillMount() {
        const { packagesStore, devicesStore } = this.props.stores;
        packagesStore.page = 'device';
        devicesStore.fetchDevice(this.props.params.id);
        packagesStore.fetchPackages();
        packagesStore.fetchPackagesHistory(this.props.params.id, packagesStore.packagesHistoryFilter);
        devicesStore.fetchDeviceNetworkInfo(this.props.params.id);
        devicesStore.fetchMultiTargetUpdates(this.props.params.id);
        devicesStore.fetchEvents(this.props.params.id);
        devicesStore.fetchApprovalPendingCampaigns(this.props.params.id);
    }
    componentWillUnmount() {
        const {packagesStore, devicesStore, hardwareStore} = this.props.stores;
        devicesStore._reset();
        packagesStore._reset();
        hardwareStore._reset();
    }
    showSequencer = (e) => {
        if (e) e.preventDefault();
        this.sequencerShown = true;
    }
    hideSequencer = (e) => {
        if (e) e.preventDefault();
        this.sequencerShown = false;
    }
    render() {
        return (
            <FadeAnimation>
                <span>
                    <MetaData
                        title={title}>
                        <DeviceContainer/>
                    </MetaData>
                    {this.sequencerShown ?
                        <DeviceSequencerModal
                            shown={this.sequencerShown}
                            hide={this.hideSequencer}
                        />
                    :
                        null
                    }
                </span>
            </FadeAnimation>
        );
    }
}

Device.propTypes = {
    stores: PropTypes.object,
}

export default Device;