import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

const circleRadius = 20;
const circleOffset = 50;

@observer
class Connectors extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
        	<div className="item">
                <div className="icon">
                    <img src="/assets/img/icons/green_tick.svg" alt="Icon" />
                </div>
                <div className="status">
                    all services online and running
                </div>
            </div>
        );
    }
}

export default Connectors;