import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { 
    DeviceHardwareOverlay, 
    DeviceHardwareSecondaryEcuDetails,
    DevicePrimaryEcu,
    DeviceSecondaryEcu
} from './hardware';
import { FadeAnimation } from '../../utils';
import _ from 'underscore';
import {
    PackagesBlacklistModal
} from '../../components/packages';

const title = "Hardware";
const primaryEcusTitle = "Primary Ecu";
const secondaryEcusTitle = "Secondary Ecus";
const noEcus = "None reported";

@observer
class HardwarePanel extends Component {
    @observable secondaryDescriptionShown = false;
    @observable popoverAnchor = false;
    @observable popoverShownFor = false;
    @observable publicKeyCopiedFor = false;
    @observable hardwareOverlayShown = false;
    @observable hardwareOverlayAnchor = null;
    @observable packageBlacklistModalShown = false;
    @observable packageBlacklistAction = {};

    constructor(props) {
        super(props);
        this.showSecondaryDescription = this.showSecondaryDescription.bind(this);
        this.hideSecondaryDescription = this.hideSecondaryDescription.bind(this);
        this.showPopover = this.showPopover.bind(this);
        this.hidePopover = this.hidePopover.bind(this);
        this.copyPublicKey = this.copyPublicKey.bind(this);
        this.resetCopyPublicKey = this.resetCopyPublicKey.bind(this);
        this.showHardwareOverlay = this.showHardwareOverlay.bind(this);
        this.hideHardwareOverlay = this.hideHardwareOverlay.bind(this);
        this.showPackageBlacklistModal = this.showPackageBlacklistModal.bind(this);
        this.hidePackageBlacklistModal = this.hidePackageBlacklistModal.bind(this);
    }
    showSecondaryDescription(e) {
        e.preventDefault();
        e.stopPropagation();
        this.secondaryDescriptionShown = true;
        this.hideHardwareOverlay();
        this.hidePopover();
    }
    hideSecondaryDescription(e) {
        if (e) e.preventDefault();
        this.secondaryDescriptionShown = false;
    }
    showPopover(id, e) {
        e.preventDefault();
        e.stopPropagation();
        const { hideHardwareOverlay } = this.props;
        this.popoverAnchor = e.currentTarget;
        this.popoverShownFor = id;
        this.hideHardwareOverlay();
    }
    hidePopover() {
        this.popoverShownFor = false;
        this.resetCopyPublicKey();
    }
    copyPublicKey(id) {
        this.publicKeyCopiedFor = id;
    }
    resetCopyPublicKey() {
        this.publicKeyCopiedFor = false;
    }
    showHardwareOverlay(e) {
        e.preventDefault();
        e.stopPropagation();
        this.hardwareOverlayShown = true;
        this.hardwareOverlayAnchor = e.currentTarget;
        this.hidePopover();
    }
    hideHardwareOverlay(e) {
        if(e) e.preventDefault();
        this.hardwareOverlayShown = false;        
    }
    showPackageBlacklistModal(name, version, mode, e) {
        if(e) e.preventDefault();
        this.packageBlacklistModalShown = true;
        this.packageBlacklistAction = {
            name: name,
            version: version,
            mode: mode
        };
        this.hideHardwareOverlay();
    }
    hidePackageBlacklistModal(e) {
        const { packagesStore } = this.props;
        if(e) e.preventDefault();
        this.packageBlacklistModalShown = false;
        this.packageBlacklistAction = {};
        packagesStore._resetBlacklistActions();
    }
    render() {
        const { 
            devicesStore, 
            hardwareStore, 
            packagesStore, 
            selectEcu, 
            onFileDrop, 
        } = this.props;
        const device = devicesStore.device;
        const isPrimaryEcuActive = hardwareStore.activeEcu.hardwareId === devicesStore._getPrimaryHardwareId();
        const primaryEcus = (
            <span>
                <div className="hardware-panel__title">
                    {primaryEcusTitle}
                </div>
                <DevicePrimaryEcu
                    active={isPrimaryEcuActive}
                    hardwareStore={hardwareStore}
                    devicesStore={devicesStore}
                    showHardwareOverlay={this.showHardwareOverlay}
                    selectEcu={selectEcu}
                    popoverShown={this.popoverShownFor === devicesStore._getPrimarySerial()}
                    showPopover={this.showPopover}
                    hidePopover={this.hidePopover}
                    copyPublicKey={this.copyPublicKey}
                    publicKeyCopied={this.publicKeyCopiedFor === devicesStore._getPrimarySerial()}
                    popoverAnchor={this.popoverAnchor}
                />
            </span>
        );
        const secondaryEcus = (
            <span>
                <div className="hardware-panel__title">
                    {secondaryEcusTitle}
                    {isPrimaryEcuActive ?
                        <img src="/assets/img/icons/black/questionmark.svg" alt="" className="hardware-panel__icon-secondary" 
                             onClick={this.showSecondaryDescription} id="hardware-secondary-ecu-details" 
                         />
                    :
                        <img src="/assets/img/icons/white/questionmark.svg" alt="" className="hardware-panel__icon-secondary" 
                             onClick={this.showSecondaryDescription} id="hardware-secondary-ecu-details" 
                         />
                    }
                </div>
                {!_.isEmpty(device.directorAttributes.secondary) || device.directorAttributes.secondary.length ?
                    _.map(device.directorAttributes.secondary, (item, index) => {
                        return (
                            <DeviceSecondaryEcu
                                active={hardwareStore.activeEcu.serial === item.id}
                                hardwareStore={hardwareStore}
                                device={device}
                                ecu={item}
                                selectEcu={selectEcu}
                                popoverShown={this.popoverShownFor === item.id}
                                hideHardwareOverlay={this.hideHardwareOverlay}
                                showPopover={this.showPopover}
                                hidePopover={this.hidePopover}
                                copyPublicKey={this.copyPublicKey}
                                publicKeyCopied={this.publicKeyCopiedFor === item.id}
                                popoverAnchor={this.popoverAnchor}
                                key={index}
                            />
                        );
                    })
                :
                    <div className="hardware-panel__no-ecus" id="hardware-secondary-not-available">
                        {noEcus}
                    </div>
                }
            </span>
        );
        return (
            <div className="hardware-panel">
                <div className="hardware-panel__header">
                    {title}
                </div>
                <div className="hardware-panel__wrapper">
                    <div className="hardware-panel__primary">
                        {primaryEcus}
                    </div>
                    <div className="hardware-panel__secondaries">
                        {secondaryEcus}
                    </div>
                    {this.hardwareOverlayShown ?
                        <DeviceHardwareOverlay
                            hardwareStore={hardwareStore}
                            hideHardwareOverlay={this.hideHardwareOverlay}
                            shown={this.hardwareOverlayShown}
                            packagesStore={packagesStore}
                            device={device}
                            showPackageBlacklistModal={this.showPackageBlacklistModal}
                            onFileDrop={onFileDrop}
                            hardwareOverlayAnchor={this.hardwareOverlayAnchor}
                        />
                    :
                        null
                    }
                    {this.secondaryDescriptionShown ?
                        <FadeAnimation>
                            <div className="overlay-animation-container">
                                <DeviceHardwareSecondaryEcuDetails
                                    hideDetails={this.hideSecondaryDescription}
                                    shown={this.secondaryDescriptionShown}
                                />
                            </div>
                        </FadeAnimation>
                    :
                        null
                    }
                </div>
                <PackagesBlacklistModal 
                    shown={this.packageBlacklistModalShown}
                    hide={this.hidePackageBlacklistModal}
                    blacklistAction={this.packageBlacklistAction}
                    packagesStore={packagesStore}
                />
            </div>
        );
    }
}

HardwarePanel.propTypes = {
    devicesStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired,
    selectEcu: PropTypes.func.isRequired,
    onFileDrop: PropTypes.func.isRequired,
}

export default HardwarePanel;