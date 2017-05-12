import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { FadeAnimation } from '../utils';
import Cookies from 'js-cookie';

@observer
class Fireworks extends Component {
    constructor(props) {
        super(props);
        this.acknowledgeWelcomePage = this.acknowledgeWelcomePage.bind(this);
    }
    componentWillMount() {
        document.body.className = "whitened";
    }
    componentDidMount() {
        if(Cookies.get('welcomePageAcknowledged') == 1) {
            this.context.router.push(`/devices`);
        }
    }
    componentWillUnmount() {
        document.body.className = document.body.className.replace("whitened", "");
    }
    acknowledgeWelcomePage() {
        Cookies.set('welcomePageAcknowledged', 1);
        this.context.router.push(`/devices`);
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
                            <button className="btn btn-main btn-manage" onClick={this.acknowledgeWelcomePage}>
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