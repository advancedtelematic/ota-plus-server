import React, { Component, PropTypes } from 'react';
import { observer, observable } from 'mobx-react';
import _ from 'underscore';
import DeviceHardwareOverlayItem from './OverlayItem';

@observer
class Overlay extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { hardware, hideDetails } = this.props;
        return (
            <div id="hardware-overlay">
                <div className="details">
                    <span className="title">
                        OVERVIEW
                    </span>
            
                    <button className="btn-close-hardware" onClick={hideDetails}>
                        <img src="/assets/img/icons/back.png" className="img-responsive" alt=""/>
                    </button>

                    <DeviceHardwareOverlayItem 
                        data={hardware}
                        mainLevel={true}
                    />

                </div>
            </div>
        );
    }
}

Overlay.propTypes = {
    hardware: PropTypes.object.isRequired,
    hideDetails: PropTypes.func.isRequired
}

export default Overlay;