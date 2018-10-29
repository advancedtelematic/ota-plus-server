import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
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

@inject("stores")
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

    onSelectQueue = () => {
        const { selectQueue } = this.props;
        selectQueue();
    }
    showSecondaryDescription = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.secondaryDescriptionShown = true;
        this.hideHardwareOverlay();
        this.hidePopover();
    }
    hideSecondaryDescription = (e) => {
        if (e) e.preventDefault();
        this.secondaryDescriptionShown = false;
    }
    showPopover = (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        const { hideHardwareOverlay } = this.props;
        this.popoverAnchor = e.currentTarget;
        this.popoverShownFor = id;
        this.hideHardwareOverlay();
    }
    hidePopover = () => {
        this.popoverShownFor = false;
        this.resetCopyPublicKey();
    }
    copyPublicKey = (id) => {
        this.publicKeyCopiedFor = id;
    }
    resetCopyPublicKey = () => {
        this.publicKeyCopiedFor = false;
    }
    showHardwareOverlay = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.hardwareOverlayShown = true;
        this.hardwareOverlayAnchor = e.currentTarget;
        this.hidePopover();
    }
    hideHardwareOverlay = (e) => {
        if(e) e.preventDefault();
        this.hardwareOverlayShown = false;        
    }
    showPackageBlacklistModal = (name, version, mode, e) => {
        if(e) e.preventDefault();
        this.packageBlacklistModalShown = true;
        this.packageBlacklistAction = {
            name: name,
            version: version,
            mode: mode
        };
        this.hideHardwareOverlay();
    }
    hidePackageBlacklistModal = (e) => {
        const { packagesStore } = this.props.stores;
        if(e) e.preventDefault();
        this.packageBlacklistModalShown = false;
        this.packageBlacklistAction = {};
        packagesStore._resetBlacklistActions();
    }

    render() {
        const { 
            selectEcu, 
            onFileDrop,
            ECUselected,
        } = this.props;
        const { 
            devicesStore, 
            hardwareStore
        } = this.props.stores;
        const { device } = devicesStore;
        const isPrimaryEcuActive = hardwareStore.activeEcu.hardwareId === devicesStore._getPrimaryHardwareId();
        const primaryEcus = (
            <span>
                <div className="hardware-panel__title">
                    {primaryEcusTitle}
                </div>
                <DevicePrimaryEcu
                    active={isPrimaryEcuActive}
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
                <div className ={"hardware-panel__overview " + (!ECUselected ? "hardware-panel__overview--selected" : "")} onClick={this.onSelectQueue}>
                    <button className={"hardware-panel__overview-button"}>OVERVIEW</button>
                </div>
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
                            hideHardwareOverlay={this.hideHardwareOverlay}
                            shown={this.hardwareOverlayShown}
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
                />
            </div>
        );
    }
}

HardwarePanel.propTypes = {
    stores: PropTypes.object,
    selectEcu: PropTypes.func.isRequired,
    onFileDrop: PropTypes.func.isRequired,
}

export default HardwarePanel;