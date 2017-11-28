import React, {Component, PropTypes} from 'react';
import {observable, observe} from 'mobx';
import {observer} from 'mobx-react';
import HardwareList from './List';
import HardwareOverlay from './Overlay';
import HardwareSecondaryEcuDetails from './SecondaryEcuDetails';
import {FadeAnimation} from '../../../utils';
import {PopoverWrapper} from '../../../partials';
import PrimaryEcu from './PrimaryEcu';
import SecondaryEcu from './SecondaryEcu';
import _ from 'underscore';

@observer
class Hardware extends Component {
    @observable keyModalShown = false;
    @observable secondaryDetailsShown = false;

    constructor(props) {
        super(props);
        this.showKey = this.showKey.bind(this);
        this.showSecondaryDetails = this.showSecondaryDetails.bind(this);
        this.hideSecondaryDetails = this.hideSecondaryDetails.bind(this);
        this.hideKey = this.hideKey.bind(this);

        this.packagesFetchHandler = observe(props.packagesStore, (change) => {
            if((change.name === 'packagesFetchAsync' || change.name === 'packagesTufFetchAsync') && change.object[change.name].isFetching === false) {
                if(props.device.isDirector) {
                    props.selectEcu(props.devicesStore._getPrimaryHardwareId(), props.devicesStore._getPrimarySerial(), props.devicesStore._getPrimaryHash(), 'primary');                    
                }
            }
        });
    }
    componentWillUnmount() {
        this.packagesFetchHandler();
    }
    showKey(e) {
        e.preventDefault();
        e.stopPropagation();
        this.keyModalShown = true;
    }
    showSecondaryDetails(e) {
        e.preventDefault();
        e.stopPropagation();
        this.secondaryDetailsShown = true;
    }
    hideSecondaryDetails(e) {
        if (e) e.preventDefault();
        this.secondaryDetailsShown = false;
    }
    hideKey(e) {
        if (e) e.preventDefault();
        this.keyModalShown = false;
    }
    render() {
        const { devicesStore, hardwareStore, packagesStore, device, activeEcu, selectEcu, showPackageBlacklistModal, onFileDrop, hardwareOverlayShown, hardwareOverlayAnchor, showHardwareOverlay, hideHardwareOverlay } = this.props;
        let active = true;
        if(device.isDirector) {
            active = activeEcu.hardwareId === devicesStore._getPrimaryHardwareId();
        }
        return (
            <span>
                <div className="hardware-list">
                    <div className="primary-ecus">
                        <PopoverWrapper
                            onOpen={() => {
                                hardwareStore.fetchPublicKey(device.uuid, devicesStore._getPrimarySerial());
                            }}
                            onClose={() => {
                                hardwareStore._resetPublicKey();
                            }}
                        >
                            <PrimaryEcu
                                active={active}
                                hardwareStore={hardwareStore}
                                devicesStore={devicesStore}
                                showKey={this.showKey}
                                showHardwareOverlay={showHardwareOverlay}
                                keyModalShown={this.keyModalShown}                                
                                device={device}
                                selectEcu={selectEcu}
                            />
                        </PopoverWrapper>
                    </div>
                    <div className="secondary-ecus">
                        <div className="section-header">
                            Secondary ECUs
                            <img src="/assets/img/icons/questionmark.png" alt="" className="hardware-secondary-details" onClick={this.showSecondaryDetails} id="hardware-secondary-ecu-details" />
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
                                        <SecondaryEcu
                                            active={activeEcu.hardwareId === item.hardwareId}
                                            ecu={item}
                                            hardwareStore={hardwareStore}
                                            showKey={this.showKey}
                                            keyModalShown={this.keyModalShown}
                                            shownIds={this.shownIds}
                                            device={device}
                                            selectEcu={selectEcu}
                                        />
                                    </PopoverWrapper>
                                );
                            })
                        :
                            <div className="not-available" id="hardware-secondary-not-available">
                                None reported
                            </div>
                        }
                    </div>
                </div>
                <HardwareOverlay
                    hardwareStore={hardwareStore}
                    hideHardwareOverlay={hideHardwareOverlay}
                    shown={hardwareOverlayShown}
                    packagesStore={packagesStore}
                    device={device}
                    showPackageBlacklistModal={showPackageBlacklistModal}
                    onFileDrop={onFileDrop}
                    hardwareOverlayAnchor={hardwareOverlayAnchor}
                />
                {this.secondaryDetailsShown ?
                    <FadeAnimation>
                        <div className="overlay-animation-container">
                            <HardwareSecondaryEcuDetails
                                hideDetails={this.hideSecondaryDetails}
                                shown={this.secondaryDetailsShown}
                            />
                        </div>
                    </FadeAnimation>
                    :
                    null
                }

            </span>
        );
    }
}

Hardware.propTypes = {
    devicesStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired,
    activeEcu: PropTypes.object,
    selectEcu: PropTypes.func.isRequired,
}

export default Hardware;