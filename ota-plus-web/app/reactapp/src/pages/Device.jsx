import React, { Component, PropTypes } from 'react';
import { observable, observe } from 'mobx';
import { observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import { MetaData, FadeAnimation } from '../utils';
import { Header } from '../partials';
import { DeviceContainer } from '../containers';
import { DeviceHeader, DeviceQueueModal } from '../components/device';

const title = "Device";

@observer
class Device extends Component {
    anchorEl = null;

    constructor(props) {
        super(props);
        this.cancelInstallation = this.cancelInstallation.bind(this);
        this.cancelMtuUpdate = this.cancelMtuUpdate.bind(this);
    }
    componentWillMount() {
        this.props.packagesStore.page = 'device';
        this.props.devicesStore.fetchInitialDevices();
        this.props.devicesStore.fetchDevice(this.props.params.id);
        this.props.packagesStore.activeDeviceId = this.props.params.id;
        this.props.packagesStore.fetchPackages();
        this.props.packagesStore.fetchBlacklist();
        this.props.packagesStore.fetchInitialDevicePackages(this.props.params.id);
        this.props.packagesStore.fetchDeviceAutoInstalledPackages(this.props.params.id);
        this.props.packagesStore.fetchDevicePackagesQueue(this.props.params.id);
        this.props.packagesStore.fetchDevicePackagesHistory(this.props.params.id);
        this.props.packagesStore.fetchDevicePackagesUpdatesLogs(this.props.params.id);
        this.props.devicesStore.fetchMultiTargetUpdates(this.props.params.id);
    }
    componentWillUnmount() {
        this.props.devicesStore._reset();
        this.props.packagesStore._reset();
        this.props.hardwareStore._reset();
    }
    cancelInstallation(requestId) {
        this.props.packagesStore.cancelInstallation(this.props.params.id, requestId);
    }
    cancelMtuUpdate(updateId) {
        let data = {
            updateId: updateId,
            deviceId: this.props.params.id
        };
        this.props.packagesStore.cancelMtuUpdate(data);
    }
    render() {
        const { devicesStore, packagesStore, hardwareStore, showQueueModal, hideQueueModal, queueModalShown, activeTabId, setQueueModalActiveTabId } = this.props;
        return (
            <FadeAnimation 
                display="flex">
                <div className="wrapper-flex">
                    <DeviceHeader
                        devicesStore={devicesStore}
                        showQueueModal={showQueueModal}
                        queueButtonRef={el => this.anchorEl = el}
                    />
                    <MetaData 
                        title={title}>
                        <DeviceContainer 
                            devicesStore={devicesStore}
                            packagesStore={packagesStore}
                            hardwareStore={hardwareStore}
                            showQueueModal={showQueueModal}
                        />
                    </MetaData>
                    <DeviceQueueModal
                        packagesStore={packagesStore}
                        devicesStore={devicesStore}
                        shown={queueModalShown}
                        hide={hideQueueModal}
                        device={devicesStore.device}
                        cancelInstallation={this.cancelInstallation}
                        cancelMtuUpdate={this.cancelMtuUpdate}
                        activeTabId={activeTabId}
                        setQueueModalActiveTabId={setQueueModalActiveTabId}
                        anchorEl={this.anchorEl}
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