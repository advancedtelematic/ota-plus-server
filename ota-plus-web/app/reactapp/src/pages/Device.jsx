import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import { MetaData, FadeAnimation } from '../utils';
import { Header } from '../partials';
import { DeviceContainer } from '../containers';
import { DeviceHeader, DeviceQueueModal } from '../components/device';

const title = "Device";

@observer
class Device extends Component {
    @observable queueModalShown = false;

    constructor(props) {
        super(props);
        this.showQueueModal = this.showQueueModal.bind(this);
        this.hideQueueModal = this.hideQueueModal.bind(this);
        this.cancelInstallation = this.cancelInstallation.bind(this);
    }
    componentWillMount() {
        this.props.packagesStore.page = 'device';
        this.props.devicesStore.fetchDevice(this.props.params.id);
        this.props.hardwareStore.fetchHardware(this.props.params.id);
        this.props.packagesStore.fetchPackages();
        this.props.packagesStore.fetchBlacklist();
        this.props.packagesStore.fetchDevicePackages(this.props.params.id);
        this.props.packagesStore.fetchDeviceAutoInstalledPackages(this.props.params.id);
        this.props.packagesStore.fetchDevicePackagesQueue(this.props.params.id);
    }
    componentWillUnmount() {
        this.props.devicesStore._reset();
        this.props.packagesStore._reset();
        this.props.hardwareStore._reset();
    }
    showQueueModal() {
        this.queueModalShown = true;
    }
    hideQueueModal() {
        this.queueModalShown = false;
    }
    cancelInstallation(requestId) {
        this.props.packagesStore.cancelInstallation(this.props.params.id, requestId);
    }
    render() {
        const { devicesStore, packagesStore, hardwareStore } = this.props;
        return (
            <FadeAnimation 
                display="flex">
                <div className="wrapper-flex">
                    <DeviceHeader
                        devicesStore={devicesStore}
                        packagesStore={packagesStore}
                        showQueueModal={this.showQueueModal}
                    />
                    <MetaData 
                        title={title}>
                        <DeviceContainer 
                            devicesStore={devicesStore}
                            packagesStore={packagesStore}
                            hardwareStore={hardwareStore}
                            showQueueModal={this.showQueueModal}
                        />
                    </MetaData>
                    <DeviceQueueModal
                        packagesStore={packagesStore}
                        shown={this.queueModalShown}
                        hide={this.hideQueueModal}
                        device={devicesStore.device}
                        cancelInstallation={this.cancelInstallation}
                    />
                </div>
            </FadeAnimation>
        );
    }
}

Device.propTypes = {
    devicesStore: PropTypes.object,
    packagesStore: PropTypes.object,
    hardwareStore: PropTypes.object,
}

export default Device;