import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Sequencer } from '../../../partials';

@observer
class WizardStep6 extends Component {
    render() {
        const { wizardIdentifier, wizardData } = this.props;
        return (
            <Sequencer
                wizardIdentifier={wizardIdentifier}
                data={wizardData[2].versions}
                entity={"campaign"}
                readOnly={false}
            />
        );
    }
}

export default WizardStep6;
