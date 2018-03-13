import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { FadeAnimation } from '../utils';
import Cookies from 'js-cookie';

@observer
class Welcome extends Component {
    @observable showNextStep = false;
    constructor(props) {
        super(props);
        this.acknowledgeWelcomePage = this.acknowledgeWelcomePage.bind(this);
    }
    componentWillMount() {
    	if (this.props.uiAutoFeatureActivation) {
            this.props.provisioningStore.activateProvisioning();
            this.props.featuresStore.activateTreehub();
		}
    }
    acknowledgeWelcomePage() {
        Cookies.set('welcomePageAcknowledged', 1);
        this.context.router.push(`/destiny`);
    }
    render() {
        const { devicesStore } = this.props;
        return (
            <FadeAnimation>
                <div className="wrapper-center wrapper-responsive">
					<div className="welcome-container">
                        <div className="content">
                            <img src="/assets/img/HERE_pos.png" className="logo" alt="Here" />
                            <p className="font-small">
                                <span>Welcome to HERE OTA Connect SaaS!</span>
                                lets you manage updates on your embedded devices from the cloud.
                            </p>
                        </div>
                        {!this.showNextStep ?
                            <div className="step">
                                <div className="title">
                                    STEP 1
                                </div>
                                <div className="body">
                                    <img src="/assets/img/onboarding_step_one.svg" alt="Image" />
                                    <div className="subtitle">
                                        Integrate our open source client
                                    </div>
                                    <div className="text font-small">
                                        Add a Yocto layer to an existing project, or follow a quickstart guide if you're new to Yocto/OpenEmbedded.
                                    </div>
                                </div>
                                <div className="next-step">
                                    <button className="btn-primary" id="next-step" onClick={() => this.showNextStep = true}>
                                        Next
                                    </button>
                                </div>
                            </div>
                            :
                            <div className="step">
                                <div className="title">
                                    STEP 2
                                </div>
                                <div className="body">
                                    <img src="/assets/img/onboarding_step_two.svg" alt="Image" />
                                    <div className="subtitle">
                                        Manage your devices
                                    </div>
                                    <div className="text font-small">
                                        Auto-update test bench devices with every new build, define target groups, and manage full filesystem revisions with ease.
                                    </div>
                                </div>
                                <div className="next-step">
                                    <button className="btn-primary" id="welcome-button" onClick={this.acknowledgeWelcomePage}>
                                        Start
                                    </button>
                                </div>
                            </div>
                        }
                	</div>
                </div>
            </FadeAnimation>
        );
    }
}

Welcome.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Welcome;