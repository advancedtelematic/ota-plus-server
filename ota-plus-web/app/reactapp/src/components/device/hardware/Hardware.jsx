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
    @observable detailsIdShown = false;
    @observable keyModalShown = false;
    @observable secondaryDetailsShown = false;

    constructor(props) {
        super(props);
        this.showDetails = this.showDetails.bind(this);
        this.showKey = this.showKey.bind(this);
        this.showSecondaryDetails = this.showSecondaryDetails.bind(this);
        this.hideSecondaryDetails = this.hideSecondaryDetails.bind(this);
        this.hideDetails = this.hideDetails.bind(this);
        this.hideKey = this.hideKey.bind(this);

        this.packagesFetchHandler = observe(props.packagesStore, (change) => {
            if(change.name === 'packagesFetchAsync' && change.object[change.name].isFetching === false) {
                if(props.device.isDirector) {
                    props.selectEcu(this.props.devicesStore._getPrimaryHardwareId(), this.props.devicesStore._getPrimarySerial(), this.props.devicesStore._getPrimaryHash(), 'primary');                    
                }
            }
        });
        
    }
    componentWillUnmount() {
        this.packagesFetchHandler();
    }
    showDetails(e) {
        e.preventDefault();
        e.stopPropagation();
        this.detailsIdShown = true;
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

    hideDetails() {
        this.detailsIdShown = false;
    }

    hideKey(e) {
        if (e) e.preventDefault();
        this.keyModalShown = false;
    }

    render() {
        const { devicesStore, hardwareStore, packagesStore, device, activeEcu, selectEcu, showPackageBlacklistModal, onFileDrop } = this.props;
        const hardware = hardwareStore.hardware[device.uuid];
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
                                showDetails={this.showDetails}
                                keyModalShown={this.keyModalShown}
                                hardware={hardware}
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
                                        key={index}
                                    >
                                        <SecondaryEcu
                                            active={activeEcu.hardwareId === item.hardwareId}
                                            ecu={item}
                                            hardwareStore={hardwareStore}
                                            showKey={this.showKey}
                                            showDetails={this.showDetails}
                                            keyModalShown={this.keyModalShown}
                                            hardware={hardware}
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

                {this.detailsIdShown ?
                    <FadeAnimation>
                        <div className="overlay-animation-container">
                            <HardwareOverlay
                                hardware={hardware}
                                hideDetails={this.hideDetails}
                                shown={this.detailsIdShown}
                                packagesStore={packagesStore}
                                device={device}
                                showPackageBlacklistModal={showPackageBlacklistModal}
                                onFileDrop={onFileDrop}
                            />
                        </div>
                    </FadeAnimation>
                    :
                    null
                }

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