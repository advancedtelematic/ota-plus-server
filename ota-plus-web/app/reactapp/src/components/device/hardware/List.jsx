import React, { Component, PropTypes } from 'react';
import _ from 'underscore';
import { SlideAnimation } from '../../../utils';

class List extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { shownIds, showDetails, showKey, showSecondaryDetails, secondaryDetailsShown, hardware, device } = this.props;
        let dataId = 0;
        if(!_.isUndefined(hardware) && !_.isUndefined(hardware.id) && (!_.isUndefined(hardware.description) || !_.isUndefined(hardware.class))) {
            dataId = hardware['id-nr'];
        }
        return (
            <span>
                <div className="section-header">
                    Primary ECUs
                </div>
                <a
                    href="#" 
                    data-id={dataId}
                    className={"selected" + (shownIds.indexOf(dataId) > -1 ? " shown" : "")}
                    id="hardware-primary-details"
                    onClick={e => e.preventDefault()}
                >
                <div className="desc">
                    { device.isDirector ? 
                        <span>
                            Serial: {device.directorAttributes.primary.id} <br />
                            Hardware ID: {device.directorAttributes.primary.hardwareId}
                        </span>
                    :
                        <span>
                            Serial: not reported <br />
                            Hardware ID: not reported
                        </span>
                    }
                    </div>
                    <div className="icons">
                        <i
                            className="fa fa-info hardware-icon key" 
                            onClick={showDetails}
                            data-id={dataId}
                        ></i>
                        <i
                            className="fa fa-key hardware-icon details" 
                            onClick={showKey}
                            data-id={dataId}
                        ></i>
                    </div>
                </a>
                <div className="section-header">
                    Secondary ECUs
                    <img src="/assets/img/icons/questionmark.png" alt="" className="hardware-secondary-details" onClick={showSecondaryDetails} />
                </div>                
                <div className="not-available" id="hardware-secondary-not-available">
                    None reported
                </div>
            </span>
        );
    }
}

List.propTypes = {
    showDetails: PropTypes.func.isRequired,
    showKey: PropTypes.func.isRequired,
    shownIds: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired
}

export default List;
