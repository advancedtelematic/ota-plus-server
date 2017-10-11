import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class AdvancedCampaigns extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="item">
                <div className="icon">
                    <img src="/assets/img/icons/green_tick.png" alt="Icon" />
                </div>
                <div className="status">
                    all services online and running
                </div>
            </div>
        );
    }
}

export default AdvancedCampaigns;