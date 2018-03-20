import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Loader, Form, FormInput } from '../../../partials';
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
        this.props.wizardData[0].name = data.name;
        if(!_.isEmpty(this.props.wizardData[0].name))
            this.props.markStepAsFinished();
        else
            this.props.markStepAsNotFinished();
    }
    render() {
        const { wizardData } = this.props;
        const campaignName = this.props.wizardData[0].name;
        return (
            <div className="step-wrapper">
                <div>
                    <Form
                        formWidth="60%"
                        id="add-campaign-name-form"
                    >
                        <FormInput
                            label="Name"
                            name="name"
                            placeholder="Name"
                            id="add-campaign-name-form-input"
                            showIcon={true}
                            title="Select campaign name"
                            previousValue={campaignName}
                            onValid={this.changeCampaignName.bind(this)}
                            onInvalid={this.changeCampaignName.bind(this)}
                        />
                    </Form>
                </div>
            </div>
        );
    }
}

WizardStep1.propTypes = {
    wizardData: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired
}

export default WizardStep1;