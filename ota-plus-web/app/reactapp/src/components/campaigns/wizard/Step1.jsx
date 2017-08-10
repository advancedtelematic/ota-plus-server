import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Loader } from '../../../partials';
import _ from 'underscore';
import { Form } from 'formsy-react';
import { FormsyText } from 'formsy-material-ui/lib';
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
            <div className="wrapper-center">
                <div>
                    <Form
                        onValid={this.changeCampaignName.bind(this)}
                        onInvalid={this.changeCampaignName.bind(this)}
                        id="add-campaign-name-form">
                        <div className="row">
                            <div className="col-xs-12">
                                <FormsyText
                                    name="name"
                                    floatingLabelText="Campaign name"
                                    className="input-wrapper"
                                    id="add-campaign-name"
                                    value={campaignName}
                                    updateImmediately
                                    required
                                />
                            </div>
                        </div>
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