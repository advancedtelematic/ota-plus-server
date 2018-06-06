import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Sequencer } from '../../../partials';

@observer
class WizardStep6 extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { wizardIdentifier, wizardData, campaignsStore } = this.props;
        return (
            <Sequencer
                campaignsStore={campaignsStore}
                wizardIdentifier={wizardIdentifier}
                data={wizardData[2].versions}
                entity={"campaign"}
                readOnly={false}
            />
        );
    }
}

export default WizardStep6;