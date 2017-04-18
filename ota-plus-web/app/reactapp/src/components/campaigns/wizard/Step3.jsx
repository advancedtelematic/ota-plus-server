import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class WizardStep3 extends Component {
    constructor(props) {
        super(props);
        this.setWizardData = this.setWizardData.bind(this);
    }
    setWizardData() {
        let stepWizardData = this.props.wizardData[2];
        stepWizardData.isActivated = !stepWizardData.isActivated;
    }
    render() {
        const { wizardData } = this.props;
        const isActivated = wizardData[2].isActivated;
        return (
            <div className="content">
                <div className="delta-switch">
                    <div className={"switch" + (isActivated ? " switchOn" : "")} onClick={this.setWizardData}>
                        <div className="switch-status">
                            {isActivated ?
                                <span>ON</span>
                            :
                                <span>OFF</span>
                            }
                        </div>
                    </div>
                </div>
                <div className="desc">
                    <span className="title">Delta switch</span>
                    <div className="text">
                        Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui,
                        non felis.  Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula. 
                        Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac, laoreet enim.
                        Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna.
                    </div>
                </div>
            </div>
        );
    }
}

WizardStep3.propTypes = {

}

export default WizardStep3;

