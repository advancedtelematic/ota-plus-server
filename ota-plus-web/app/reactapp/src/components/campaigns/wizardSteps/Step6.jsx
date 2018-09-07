import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Sequencer } from '../../../partials';

@observer
class WizardStep6 extends Component {
    render() {
        //const { wizardIdentifier, wizardData } = this.props;
        {/*<Sequencer
                wizardIdentifier={wizardIdentifier}
                data={wizardData.versions}
                entity={"campaign"}
                readOnly={false}
            />*/}
        return (
            <div className="wrapper-center">
                { "Currently no information available." }
            </div>
        );
    }
}

export default WizardStep6;
