import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Form, FormInput } from '../../../partials';
import _ from 'underscore';
import serialize from 'form-serialize';

@observer
class WizardStep1 extends Component {
    constructor(props) {
        super(props);
        this.changeCampaignName = this.changeCampaignName.bind(this);
    }

    changeCampaignName() {
        let data = serialize(document.querySelector('#add-campaign-name-form'), { hash: true });
        this.props.wizardData.name = data.name;
        if (!_.isEmpty(this.props.wizardData.name))
            this.props.markStepAsFinished();
        else
            this.props.markStepAsNotFinished();
    }

    render() {
        const { name: campaignName } = this.props.wizardData;
        return (
            <div className="step-wrapper">
                <div>
                    <Form
                        formWidth="60%"
                        id="add-campaign-name-form"
                        onSubmit={ (e) => e.preventDefault() }
                    >
                        <FormInput
                            label="Name"
                            name="name"
                            placeholder="Name"
                            id="add-campaign-name-form-input"
                            showIcon={ false }
                            title="Select campaign name"
                            previousValue={ campaignName }
                            onValid={ this.changeCampaignName.bind(this) }
                            onInvalid={ this.changeCampaignName.bind(this) }
                        />
                    </Form>
                </div>
            </div>
        );
    }
}

WizardStep1.propTypes = {
    wizardData: PropTypes.object.isRequired,
};

export default WizardStep1;