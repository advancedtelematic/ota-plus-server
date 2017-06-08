import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { FadeAnimation } from '../utils';
import Cookies from 'js-cookie';
import _ from 'underscore';

@observer
class Fireworks extends Component {
    constructor(props) {
        super(props);
        this.acknowledgeFireworks = this.acknowledgeFireworks.bind(this);
    }
    componentWillMount() {
        Cookies.set('fireworksPageAcknowledged', 1);
        if(this.props.devicesStore.onlineDevices.length === 0) {
            this.props.devicesStore.fetchInitialDevices();
        }
    }    
    acknowledgeFireworks() {
        let deviceOnline = _.first(this.props.devicesStore.onlineDevices);
        this.context.router.push(`/device/` + deviceOnline.uuid);
    }
    render() {
        const { devicesStore } = this.props;
        return (
            <FadeAnimation>
                <div className="wrapper-center">
                	<div className="fireworks-container">
                        <div className="item">
                            <div className="title">
                                CONGRATULATIONS
                            </div>
                            <div className="body">
                                <img src="/assets/img/icons/Fireworks_screen.gif" alt="Image" />
                                <div className="subtitle">
                                    Your first device is online!
                                </div>
                                <div className="text">
                                    Every time you build a new image, you can send it to this device over the air.
                                </div>
                            </div>
                        </div>
                        <div className="manage">
                            <button className="btn btn-main btn-manage" onClick={this.acknowledgeFireworks}>
                                Go to my device
                            </button>
                        </div>
                	</div>
                </div>
            </FadeAnimation>
        );
    }
}

Fireworks.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Fireworks;