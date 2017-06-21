import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import HardwareList from './List';
import HardwareSecondaryEcuDetails from './SecondaryEcuDetails';
import { PopoverWrapper } from '../../../partials';
import PrimaryEcu from './PrimaryEcu';
import { FadeAnimation } from '../../../utils';
import _ from 'underscore';

@observer
class Hardware extends Component {
    @observable detailsIdShown = null;
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
    }
    showDetails(e) {
        e.preventDefault();
        e.stopPropagation();
        this.detailsIdShown = e.target.dataset.id;
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
        if(e) e.preventDefault();
        this.secondaryDetailsShown = false;
    }
    hideDetails(e) {
        if(e) e.preventDefault();
        this.detailsIdShown = null;
    }
    hideKey(e) {
        if(e) e.preventDefault();
        this.keyModalShown = false;
    }
    render() {
        const { hardwareStore, device } = this.props;
        const hardware = hardwareStore.hardware[device.uuid];
        const primaryEcu = hardware;
        return (
            <span>
                <div className="hardware-list">
                    <div className="primary-ecus">
                        <PopoverWrapper
                            onOpen={() => {
                                hardwareStore.fetchPublicKey(device.uuid, _.first(device.directorAttributes).id);
                            }}
                            onClose={() => {
                                hardwareStore._resetPublicKey();
                            }}
                        >
                            <PrimaryEcu
                                ecu={primaryEcu}
                                hardwareStore={hardwareStore}
                                showKey={this.showKey}
                                showDetails={this.showDetails}
                                hideDetails={this.hideDetails}
                                detailsIdShown={this.detailsIdShown}
                                keyModalShown={this.keyModalShown}
                                hardware={hardware}
                                device={device}
                            />
                        </PopoverWrapper>
                    </div>
                    <div className="secondary-ecus">
                        <div className="section-header">
                            Secondary ECUs
                            <img src="/assets/img/icons/questionmark.png" alt="" className="hardware-secondary-details" onClick={this.showSecondaryDetails} id="hardware-secondary-ecu-details" />
                        </div>                
                        <div className="not-available" id="hardware-secondary-not-available">
                            None reported
                        </div>
                    </div>
                </div>

                <FadeAnimation>
                    <div className="overlay-animation-container">
                        <HardwareSecondaryEcuDetails 
                            hideDetails={this.hideSecondaryDetails}
                            shown={this.secondaryDetailsShown}
                        />
                    </div>
                </FadeAnimation>

            </span>
        );
    }
}

Hardware.propTypes = {
    hardwareStore: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired
}

export default Hardware;