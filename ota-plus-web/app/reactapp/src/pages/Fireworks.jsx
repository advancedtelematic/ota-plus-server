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
        this.props.devicesStore.fetchDevicesCount();
    }    
    acknowledgeFireworks() {
        let directorDeviceId = _.first(this.props.devicesStore.directorDevicesIds);
        this.context.router.push(`/device/` + directorDeviceId);
    }
    render() {
        return (
            <FadeAnimation>
                <div className="wrapper-center">
                	<div className="fireworks">
                        <div className="fireworks__title">
                            CONGRATULATIONS
                        </div>
                        <div className="fireworks__body">
                            <img className="fireworks__icon" src="/assets/img/icons/fireworks_check.svg" alt="Image" />
                            <div className="fireworks__subtitle">
                                Your first device is online!
                            </div>
                            <div className="fireworks__text">
                                Every time you build a new image, you can send it to this device over the air.
                            </div>                            
                        </div>
                        <div className="fireworks__action">
                            <button className="fireworks__button btn-primary" onClick={this.acknowledgeFireworks}>
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