import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import HardwareList from './List';
import HardwareOverlay from './Overlay';
import HardwareSecondaryEcuDetails from './SecondaryEcuDetails';
import { FadeAnimation } from '../../../utils';
import _ from 'underscore';

@observer
class Hardware extends Component {
    @observable detailsIdShown = null;
    @observable secondaryDetailsShown = false;
    @observable shownIds = [];

    constructor(props) {
        super(props);
        this.showDetails = this.showDetails.bind(this);
        this.showSecondaryDetails = this.showSecondaryDetails.bind(this);
        this.hideSecondaryDetails = this.hideSecondaryDetails.bind(this);
        this.hideDetails = this.hideDetails.bind(this);
    }
    showDetails(e) {
        e.preventDefault();
        e.stopPropagation();
        this.detailsIdShown = e.target.dataset.id
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
    render() {
        const { hardwareStore, deviceId } = this.props;
        let hardware = hardwareStore.hardware[deviceId];
        return (
            <span>
                <div className="hardware-list">
                    <HardwareList 
                        hardware={hardware}
                        showDetails={this.showDetails}
                        showSecondaryDetails={this.showSecondaryDetails}
                        shownIds={this.shownIds}
                        secondaryDetailsShown={this.secondaryDetailsShown}
                    />
                </div>

                {this.detailsIdShown ?
                    <FadeAnimation>
                        <div className="overlay-animation-container">
                            <HardwareOverlay 
                                hardware={hardware}
                                hideDetails={this.hideDetails}
                                shown={this.detailsIdShown ? true : false}
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
    hardwareStore: PropTypes.object.isRequired
}

export default Hardware;