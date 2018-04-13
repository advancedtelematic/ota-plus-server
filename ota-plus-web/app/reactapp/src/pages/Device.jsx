import React, { Component, PropTypes } from 'react';
import { observable, observe } from 'mobx';
import { observer } from 'mobx-react';
import { browserHistory } from 'react-router';
import _ from 'underscore';
import { MetaData, FadeAnimation } from '../utils';
import { Header } from '../partials';
import { DeviceContainer } from '../containers';
import { DeviceHeader, DeviceQueueModal, DeviceSequencerModal } from '../components/device';

const title = "Device";

@observer
class Device extends Component {
    queueAnchorEl = null;
    @observable packagesReady = false;
    @observable sequencerShown = false;
    @observable disableExpand = false;

    constructor(props) {
        super(props);
        this.cancelMtuUpdate = this.cancelMtuUpdate.bind(this);
        this.selectEcu = this.selectEcu.bind(this);
        this.showSequencer = this.showSequencer.bind(this);
        this.hideSequencer = this.hideSequencer.bind(this);

        this.packagesFetchHandler = observe(props.packagesStore, (change) => {
            if(change.name === 'packagesFetchAsync' && !change.object[change.name].isFetching) {
                this.selectEcu(
                    props.devicesStore._getPrimaryHardwareId(), 
                    props.devicesStore._getPrimarySerial(), 
                    props.devicesStore._getPrimaryFilepath(), 
                    'primary'
                );
                this.packagesReady = true;
            }
        });

        this.autoInstallHandler = observe(props.packagesStore, (change) => {
            if((change.name === 'packagesEnableAutoInstallAsync' || change.name === 'packagesDisableAutoInstallAsync') 
                && !_.isMatch(change.oldValue, change.object[change.name])) {
                    this.disableExpand = true;
            }
        });
    }
    componentWillMount() {
        this.props.packagesStore.page = 'device';
        this.props.devicesStore.fetchDevice(this.props.params.id);
        this.props.packagesStore.fetchPackages();
        this.props.devicesStore.fetchMultiTargetUpdates(this.props.params.id);
    }
    componentWillUnmount() {
        this.packagesFetchHandler();
        this.autoInstallHandler();
        this.props.devicesStore._reset();
        this.props.packagesStore._reset();
        this.props.hardwareStore._reset();
    }
    showSequencer(e) {
        if(e) e.preventDefault();
        this.props.hideQueueModal();
        this.sequencerShown = true;
    }
    hideSequencer(e) {
        if(e) e.preventDefault();
        this.sequencerShown = false;
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
        packagesStore.fetchAutoInstalledPackages(devicesStore.device.uuid, serial);
        this.disableExpand = false;
    }
    render() {
        const { 
            devicesStore, 
            packagesStore, 
            campaignsStore, 
            hardwareStore, 
            showQueueModal, 
            hideQueueModal, 
            queueModalShown, 
            activeTabId, 
            setQueueModalActiveTabId,
            backButtonAction,
            alphaPlusEnabled
        } = this.props;
        return (
            <FadeAnimation>
                <span>
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
                            campaignsStore={campaignsStore}
                            hardwareStore={hardwareStore}
                            showQueueModal={showQueueModal}
                            selectEcu={this.selectEcu}
                            packagesReady={this.packagesReady}
                            disableExpand={this.disableExpand}
                        />
                    </MetaData>
                    <DeviceQueueModal
                        packagesStore={packagesStore}
                        devicesStore={devicesStore}
                        shown={queueModalShown}
                        hide={hideQueueModal}
                        cancelMtuUpdate={this.cancelMtuUpdate}
                        activeTabId={activeTabId}
                        setQueueModalActiveTabId={setQueueModalActiveTabId}
                        anchorEl={this.queueAnchorEl}
                        alphaPlusEnabled={alphaPlusEnabled}
                        showSequencer={this.showSequencer}
                    />
                    {this.sequencerShown ?
                        <DeviceSequencerModal 
                            shown={this.sequencerShown}
                            hide={this.hideSequencer}
                            campaignsStore={campaignsStore}
                            devicesStore={devicesStore}
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
    devicesStore: PropTypes.object,
    packagesStore: PropTypes.object,
    campaignsStore: PropTypes.object,
    hardwareStore: PropTypes.object,
    showQueueModal: PropTypes.func,
    hideQueueModal: PropTypes.func,
    queueModalShown: PropTypes.bool,
    activeTabId: PropTypes.number,
    setQueueModalActiveTabId: PropTypes.func,
}

export default Device;