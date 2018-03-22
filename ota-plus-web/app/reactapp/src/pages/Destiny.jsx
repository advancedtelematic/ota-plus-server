import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { FadeAnimation } from '../utils';
import Cookies from 'js-cookie';

@observer
class Destiny extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        if(Cookies.get('welcomePageAcknowledged') != 1) {
            this.context.router.push(`/welcome`);
        }
    }
    render() {
        const { devicesStore } = this.props;
        return (
            <FadeAnimation>
                <div className="wrapper-center wrapper-responsive">
                    <div className="destiny-container">
                        <div className="item new">
                            <div className="title">
                                START FRESH
                            </div>
                            <div className="body">
                                <img src="/assets/img/onboarding_start_fresh.svg" alt="Image" />
                                <div className="subtitle">
                                    Try out a quickstart project
                                </div>
                                <div className="text">
                                    New to Yocto? We'll take you through a starter project step by step.
                                </div>
                                <p>10 min</p>
                                <div className="action">
                                    <a href="http://docs.atsgarage.com/quickstarts/raspberry-pi.html" target="_blank" className="btn-primary" id="user-new-yocto-docs">
                                        Guide
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="item existing">
                            <div className="title">
                                INTEGRATE
                            </div>
                            <div className="body">
                                <img src="/assets/img/onboarding_integrate.svg" alt="Image" />
                                <div className="subtitle">
                                    Integrate with existing project
                                </div>
                                <div className="text">
                                    Add the meta-updater layer into your existing Yocto project and OTA-enable your devices.
                                </div>
                                <p>10 min</p>
                                <div className="action">
                                    <a href="http://docs.atsgarage.com/quickstarts/adding-ats-garage-updating-to-an-existing-yocto-project.html" target="_blank" className="btn-primary" id="user-existing-yocto-docs">
                                        Guide
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </FadeAnimation>
        );
    }
}

Destiny.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Destiny;