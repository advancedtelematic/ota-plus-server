import React, { Component, PropTypes } from 'react';
import _ from 'underscore';
import { SlideAnimation } from '../../../utils';

class List extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { shownIds, showDetails, detailsIdShown, hardware } = this.props;
        return (
            <span>
                <div className="section-header">
                    Primary ECU
                </div>
                {!_.isUndefined(hardware.id) && (!_.isUndefined(hardware.description) || !_.isUndefined(hardware.class)) ?
                    <a 
                        href="#" 
                        data-id={hardware['id-nr']}
                        className={"selected" + (shownIds.indexOf(hardware['id-nr']) > -1 ? " shown" : "")}
                        onClick={e => e.preventDefault()}
                    >
                        <div className="desc">
                            Serial: HGE3-123D-23KD-LDU3W922SW <br />
                            Hardware ID: 123SSD-3FF2RR-5FNRHF
                        </div>
                        <i 
                            className="fa fa-info hardware-info-icon" 
                            onClick={showDetails}
                            data-id={hardware['id-nr']}
                        ></i>
                    </a>
                :
                    <div className="not-available">
                        Not available
                    </div>
                }
                <div className="section-header">
                    Secondary ECU
                </div>
                <div className="not-available">
                    Not available
                </div>
            </span>
        );
    }
}

List.propTypes = {
    hardware: PropTypes.object.isRequired,
    showDetails: PropTypes.func.isRequired,
    shownIds: PropTypes.object.isRequired,
    detailsIdShown: PropTypes.string,
}

export default List;
