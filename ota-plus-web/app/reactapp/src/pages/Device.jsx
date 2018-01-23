import React, { Component, PropTypes } from 'react';
import { observable, observe } from 'mobx';
import { observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import _ from 'underscore';
import { MetaData, FadeAnimation } from '../utils';
import { Header } from '../partials';
import { DeviceContainer } from '../containers';
import { DeviceHeader, DeviceQueueModal } from '../components/device';

const title = "Device";

@observer
class Device extends Component {
    queueAnchorEl = null;
    @observable packagesReady = false;

    constructor(props) {
        super(props);
        this.cancelInstallation = this.cancelInstallation.bind(this);
        this.cancelMtuUpdate = this.cancelMtuUpdate.bind(this);
        this.selectEcu = this.selectEcu.bind(this);

        this.deviceFetchHandler = observe(props.devicesStore, (change) => {
            if(change.name === 'devicesOneFetchAsync' && !change.object[change.name].isFetching) {
                if(props.devicesStore.device.isDirector) {
                    props.packagesStore.fetchTufPackages();
                    props.devicesStore.fetchMultiTargetUpdates(props.params.id);
                } else {
                    if(this.props.isLegacyShown) {
                        props.packagesStore.fetchPackages();
                    }
                    props.packagesStore.fetchInitialDevicePackages(props.params.id);
                    props.packagesStore.fetchBlacklist();
                    props.packagesStore.fetchDeviceAutoInstalledPackages(props.params.id);
                    props.packagesStore.fetchDevicePackagesQueue(props.params.id);
                    props.packagesStore.fetchDevicePackagesHistory(props.params.id);
                    props.packagesStore.fetchDevicePackagesUpdatesLogs(props.params.id);
                }
            }
        });

        this.tufPackagesFetchHandler = observe(props.packagesStore, (change) => {
            if(change.name === 'packagesTufFetchAsync' && !change.object[change.name].isFetching) {
                this.selectEcu(
                    props.devicesStore._getPrimaryHardwareId(), 
                    props.devicesStore._getPrimarySerial(), 
                    props.devicesStore._getPrimaryFilepath(), 
                    'primary'
                );
                this.packagesReady = true;
            }
        });

        this.packagesFetchHandler = observe(props.packagesStore, (change) => {
            if(change.name === 'packagesFetchAsync' && !change.object[change.name].isFetching) {
                this.packagesReady = true;              
            }
        });

        this.mtuFetchHandler = observe(props.devicesStore, (change) => {
            if(change.name === 'multiTargetUpdatesFetchAsync' && !change.object[change.name].isFetching) {
                props.packagesStore._addPackagesToQueue(props.devicesStore.multiTargetUpdates, props.hardwareStore.activeEcu.serial);
            }
        });
    }
    componentWillMount() {
        this.props.packagesStore.page = 'device';
        this.props.devicesStore.fetchDevice(this.props.params.id);
    }
    componentWillUnmount() {
        this.props.devicesStore._reset();
        this.props.packagesStore._reset();
        this.props.hardwareStore._reset();
        this.deviceFetchHandler();
        this.tufPackagesFetchHandler();
        this.packagesFetchHandler();
        this.mtuFetchHandler();
    }
    cancelInstallation(requestId) {
        const { packagesStore } = this.props;
        packagesStore.cancelInstallation(this.props.params.id, requestId);
    }
    cancelMtuUpdate(updateId) {
        const { devicesStore } = this.props;
        let deviceId = this.props.params.id;
        let data = {
            update: updateId,
            device: deviceId
        };
        devicesStore.cancelMtuUpdate(data);
    }
    selectEcu(hardwareId, serial, filepath, type, e) {
        if(e) e.preventDefault();
        const { packagesStore, devicesStore, hardwareStore } = this.props;
        hardwareStore.activeEcu = {
            hardwareId: hardwareId,
            serial: serial,
            type: type
        };
        let expandedPackage = packagesStore._getInstalledPackage(filepath, hardwareId);
        if(!expandedPackage) {
            packagesStore.expandedPackage = {
                unmanaged: true
            };
        } else {
             packagesStore.expandedPackage = expandedPackage;
        }
        packagesStore.fetchDirectorDeviceAutoInstalledPackages(devicesStore.device.uuid, serial);
        packagesStore._addPackagesToQueue(devicesStore.multiTargetUpdates, serial);
    }
    render() {
        const { 
            devicesStore, 
            packagesStore, 
            hardwareStore, 
            showQueueModal, 
            hideQueueModal, 
            queueModalShown, 
            activeTabId, 
            setQueueModalActiveTabId,
            backButtonAction
        } = this.props;
        return (
            <FadeAnimation 
                display="flex">
                <div className="wrapper-flex">
                    <DeviceHeader
                        devicesStore={devicesStore}
                        device={devicesStore.device}
                        showQueueModal={showQueueModal}
                        queueButtonRef={el => this.queueAnchorEl = el}
                        backButtonAction={backButtonAction}
                    />
                    <MetaData 
                        title={title}>
                        <DeviceContainer 
                            devicesStore={devicesStore}
                            packagesStore={packagesStore}
                            hardwareStore={hardwareStore}
                            showQueueModal={showQueueModal}
                            selectEcu={this.selectEcu}
                            packagesReady={this.packagesReady}
                        />
                    </MetaData>
                    <DeviceQueueModal
                        packagesStore={packagesStore}
                        devicesStore={devicesStore}
                        shown={queueModalShown}
                        hide={hideQueueModal}
                        cancelInstallation={this.cancelInstallation}
                        cancelMtuUpdate={this.cancelMtuUpdate}
                        activeTabId={activeTabId}
                        setQueueModalActiveTabId={setQueueModalActiveTabId}
                        anchorEl={this.queueAnchorEl}
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
    showQueueModal: PropTypes.func,
    hideQueueModal: PropTypes.func,
    queueModalShown: PropTypes.bool,
    activeTabId: PropTypes.number,
    setQueueModalActiveTabId: PropTypes.func,
}

export default Device;