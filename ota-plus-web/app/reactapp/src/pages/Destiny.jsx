import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { FadeAnimation } from '../utils';
import Cookies from 'js-cookie';

@observer
class Destiny extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        document.body.className = "whitened";
    }
    componentDidMount() {
        if(Cookies.get('welcomePageAcknowledged') != 1) {
            this.context.router.push(`/welcome`);
        }
    }
    componentWillUmnount() {
        document.body.className = document.body.className.replace("whitened", "");
    }
    render() {
        const { devicesStore } = this.props;
        return (
            <FadeAnimation>
                <div className="wrapper-center">
                    <div className="destiny-container">
                        <div className="heading">
                            <div className="title">
                                Choose your destiny.
                            </div>
                        </div>
                        <div className="item new">
                            <div className="icon">
                                <img src="/assets/img/icons/destiny_10_min.png" alt="Image" />
                            </div>
                            <div className="title">
                                NEW
                            </div>
                            <div className="body">
                                <img src="/assets/img/icons/destiny_new.png" alt="Image" />
                                <div className="subtitle">
                                    Try out a quickstart project
                                </div>
                                <div className="text">
                                    New to Yocto? We'll take you through a starter project step by step.
                                </div>
                                <div className="action">
                                    <a href="http://docs.atsgarage.com/start-yocto/your-first-ostreeenabled-yocto-project.html" target="_blank" className="btn btn-main" id="user-new-yocto-docs">
                                        Create new
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="item existing">
                            <div className="icon">
                                <img src="/assets/img/icons/destiny_10_min.png" alt="Image" />
                            </div>
                            <div className="title">
                                EXISTING
                            </div>
                            <div className="body">
                                <img src="/assets/img/icons/destiny_existing.png" alt="Image" />
                                <div className="subtitle">
                                    Integrate with existing project
                                </div>
                                <div className="text">
                                    Add the meta-updater layer into your existing Yocto project and OTA-enable your devices.
                                </div>
                                <div className="action">
                                    <a href="http://docs.atsgarage.com/start-yocto/adding-ostree-updates-to-your-existing-yocto-project.html" target="_blank" className="btn btn-main" id="user-existing-yocto-docs">
                                        Add to existing
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