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
import { PopoverWrapper } from '../../partials';
import _ from 'underscore';

const title = "Hardware";
const primaryEcusTitle = "Primary Ecus";
const secondaryEcusTitle = "Secondary Ecus";
const noEcus = "None reported";

@observer
class HardwarePanel extends Component {
    @observable secondaryDescriptionShown = false;

    constructor(props) {
        super(props);
        this.showSecondaryDescription = this.showSecondaryDescription.bind(this);
        this.hideSecondaryDescription = this.hideSecondaryDescription.bind(this);
    }
    showSecondaryDescription(e) {
        e.preventDefault();
        e.stopPropagation();
        this.secondaryDescriptionShown = true;
    }
    hideSecondaryDescription(e) {
        if (e) e.preventDefault();
        this.secondaryDescriptionShown = false;
    }
    render() {
        const { 
            devicesStore, 
            hardwareStore, 
            packagesStore, 
            selectEcu, 
            showPackageBlacklistModal, 
            onFileDrop, 
            hardwareOverlayShown, 
            hardwareOverlayAnchor, 
            showHardwareOverlay, 
            hideHardwareOverlay 
        } = this.props;
        const device = devicesStore.device;
        let isPrimaryEcuActive = true;
        if(device.isDirector) {
            isPrimaryEcuActive = hardwareStore.activeEcu.hardwareId === devicesStore._getPrimaryHardwareId();
        }
        const primaryEcus = (
            <span>
                <div className="section-header">
                    {primaryEcusTitle}
                </div>
                <PopoverWrapper
                    onOpen={() => {
                        hardwareStore.fetchPublicKey(device.uuid, devicesStore._getPrimarySerial());
                    }}
                    onClose={() => {
                        hardwareStore._resetPublicKey();
                    }}
                >
                    <DevicePrimaryEcu
                        active={isPrimaryEcuActive}
                        hardwareStore={hardwareStore}
                        devicesStore={devicesStore}
                        showHardwareOverlay={showHardwareOverlay}
                        selectEcu={selectEcu}
                    />
                </PopoverWrapper>
            </span>
        );
        const secondaryEcus = (
            <span>
                <div className="section-header">
                    {secondaryEcusTitle}
                    <img src="/assets/img/icons/questionmark.png" alt="" className="hardware-secondary-details" 
                         onClick={this.showSecondaryDescription} id="hardware-secondary-ecu-details" 
                     />
                </div>
                {device.isDirector && !_.isEmpty(device.directorAttributes.secondary) ?
                    _.map(device.directorAttributes.secondary, (item, index) => {
                        return (
                            <PopoverWrapper
                                onOpen={() => {
                                    hardwareStore.fetchPublicKey(device.uuid, item.id);
                                }}
                                onClose={() => {
                                    hardwareStore._resetPublicKey();
                                }}
                                animated={false}
                                key={index}
                            >
                                <DeviceSecondaryEcu
                                    active={hardwareStore.activeEcu.hardwareId === item.hardwareId}
                                    ecu={item}
                                    hardwareStore={hardwareStore}
                                    selectEcu={selectEcu}
                                />
                            </PopoverWrapper>
                        );
                    })
                :
                    <div className="not-available" id="hardware-secondary-not-available">
                        {noEcus}
                    </div>
                }
            </span>
        );
        return (
            <div className="hardware-panel">
                <div className="darkgrey-header">
                    {title}
                </div>
                <div className="inner-container">
                    <div className="hardware-list">
                        <div className="primary-ecus font-small">
                            {primaryEcus}
                        </div>
                        <div className="secondary-ecus font-small">
                            {secondaryEcus}
                        </div>
                    </div>
                    <DeviceHardwareOverlay
                        hardwareStore={hardwareStore}
                        hideHardwareOverlay={hideHardwareOverlay}
                        shown={hardwareOverlayShown}
                        packagesStore={packagesStore}
                        device={device}
                        showPackageBlacklistModal={showPackageBlacklistModal}
                        onFileDrop={onFileDrop}
                        hardwareOverlayAnchor={hardwareOverlayAnchor}
                    />
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
            </div>
        );
    }
}

HardwarePanel.propTypes = {
    devicesStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired,
    selectEcu: PropTypes.func.isRequired,
    showPackageBlacklistModal: PropTypes.func.isRequired,
    onFileDrop: PropTypes.func.isRequired,
    hardwareOverlayShown: PropTypes.bool.isRequired,
    hardwareOverlayAnchor: PropTypes.object,
    showHardwareOverlay: PropTypes.func.isRequired,
    hideHardwareOverlay: PropTypes.func.isRequired,
}

export default HardwarePanel;