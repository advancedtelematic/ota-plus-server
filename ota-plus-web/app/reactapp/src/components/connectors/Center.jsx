import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';

@observer
class Center extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
           <div className="center-container">
                <canvas id="item-canvas-center" className="item-canvas-center" width="555" height="545"></canvas>
                <div className="logo">
                    <img src="/assets/img/otaplus.png" alt="Logo" />
                </div>
            </div>
        );
    }
}

export default Center;