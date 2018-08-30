import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { SelectUpdateList } from './step3Files';
import { Form } from '../../../partials';
import _ from "underscore";

@inject("stores")
@observer
class WizardStep3 extends Component {
    constructor(props) {
        super(props);
        this.validateStep = this.validateStep.bind(this);
        this.changeUpdateSelection = this.changeUpdateSelection.bind(this);
        this.showDetails = this.showDetails.bind(this);
    }

    validateStep = (selectedUpdate) => {
        if (selectedUpdate && selectedUpdate.length) {
            this.props.markStepAsFinished();
        } else {
            this.props.markStepAsNotFinished();
        }
    };

    changeUpdateSelection = (update) => {
        const { wizardData, currentStepId } = this.props;
        const stepData = wizardData[currentStepId];
        let selectedUpdate = stepData.update;

        if (!_.isEqual(selectedUpdate.pop(), update)) {
            selectedUpdate.push(update);
        }

        this.validateStep(selectedUpdate);
    };

    showDetails = (update, e) => {
        if (e) {
            e.preventDefault();
        }
        this.props.showUpdateDetails(update);
    };

    render() {
        const { wizardData, currentStepId } = this.props;

        return (
            <div>
                <Form>
                    <label title="" className="c-form__label">{ "Select Update" }</label>
                </Form>
                <SelectUpdateList
                    wizardData={ wizardData }
                    stepId={ currentStepId }
                    stores={ this.props.stores }
                    toggleSelection={ this.changeUpdateSelection }
                    showUpdateDetails={ this.showDetails }
                />
            </div>
        );
    }
}

WizardStep3.propTypes = {
    wizardData: PropTypes.object.isRequired,
    currentStepId: PropTypes.number.isRequired,
    setWizardData: PropTypes.func.isRequired,
    stores: PropTypes.object,
};

export default WizardStep3;

