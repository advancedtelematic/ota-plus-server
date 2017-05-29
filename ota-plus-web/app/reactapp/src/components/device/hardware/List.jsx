import React, { Component, PropTypes } from 'react';
import _ from 'underscore';
import { SlideAnimation } from '../../../utils';

class List extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { shownIds, showDetails, showSecondaryDetails, secondaryDetailsShown, hardware } = this.props;
        let dataId = 0;
        if(!_.isUndefined(hardware.id) && (!_.isUndefined(hardware.description) || !_.isUndefined(hardware.class))) {
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
                        Serial: not reported <br />
                        Hardware ID: not reported
                    </div>
                    <i
                        className="fa fa-info hardware-info-icon" 
                        onClick={showDetails}
                        data-id={dataId}
                    ></i>
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
    hardware: PropTypes.object.isRequired,
    showDetails: PropTypes.func.isRequired,
    shownIds: PropTypes.object.isRequired,
}

export default List;
