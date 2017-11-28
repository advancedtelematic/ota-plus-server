import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { FadeAnimation } from '../utils';
import Cookies from 'js-cookie';

@observer
class Welcome extends Component {
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
                	<div className="steps-container">
    	            	<div className="heading">
    		            	<div className="title welcome-title">
    		            		Welcome to ATS Garage!
    		            	</div>
                            <div className="subtitle">
                                ATS Garage lets you manage updates on your embedded devices from the cloud.
                            </div>
    	            	</div>
                		<div className="step-one">
                			<div className="title">
                				STEP 1
                			</div>
                			<div className="body">
                				<img src="/assets/img/onboarding_step_one.png" alt="Image" />
                				<div className="subtitle">
                					Integrate our open source client
                				</div>
                				<div className="text">
                					Add a Yocto layer to an existing project, or follow a quickstart guide if you're new to Yocto/OpenEmbedded.
                				</div>
                			</div>
                		</div>
                		<div className="step-two">
                			<div className="title">
                				STEP 2
                			</div>
                			<div className="body">
                				<img src="/assets/img/onboarding_step_two.png" alt="Image" />
                				<div className="subtitle">
                					Manage your devices
                				</div>
                				<div className="text">
                					Auto-update test bench devices with every new build, define target groups, and manage full filesystem revisions with ease.
                				</div>
                			</div>
                		</div>
                		<div className="start">
                			<button className="btn btn-main btn-start" id="welcome-button" onClick={this.acknowledgeWelcomePage}>
                                Start
                            </button>
                		</div>
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