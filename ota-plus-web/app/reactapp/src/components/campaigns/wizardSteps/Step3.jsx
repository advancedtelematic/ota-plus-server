import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { SelectUpdateList } from './step3Files';
import { Form } from '../../../partials';
import _ from "underscore";
import Loader from "../../../partials/Loader";

@inject("stores")
@observer
class WizardStep3 extends Component {
    constructor(props) {
        super(props);
        this.validateStep = this.validateStep.bind(this);
        this.changeUpdateSelection = this.changeUpdateSelection.bind(this);
        this.showDetails = this.showDetails.bind(this);
    }

    componentWillMount() {
        const { wizardData } = this.props;
        let selectedGroupIds = wizardData.groups.map(group => (group.id));
        const { updatesStore } = this.props.stores;
        updatesStore.fetchWizardUpdates(selectedGroupIds);
    }

    validateStep = (selectedUpdate) => {
        if (selectedUpdate && selectedUpdate.length) {
            this.props.markStepAsFinished();
        } else {
            this.props.markStepAsNotFinished();
        }
    };

    changeUpdateSelection = (update) => {
        const { wizardData } = this.props;

        if (!_.isEqual(wizardData.update.pop(), update)) {
            wizardData.update.push(update);
        }

        this.validateStep(wizardData.update);
    };

    showDetails = (update, e) => {
        if (e) {
            e.preventDefault();
        }
        this.props.showUpdateDetails(update);
    };

    render() {
        const { wizardData } = this.props;
        const { updatesStore } = this.props.stores;

        return (
            updatesStore.updatesWizardFetchAsync.isFetching ?
                <div className="wrapper-center">
                    <Loader />
                </div>
                :
                <div>
                    <Form>
                        <label title="" className="c-form__label">{ "Select Update" }</label>
                    </Form>
                    <SelectUpdateList
                        wizardData={ wizardData }
                        stepId={ 2 }
                        stores={ this.props.stores }
                        toggleSelection={ this.changeUpdateSelection }
                        showUpdateDetails={ this.showDetails }
                    />
                </div>
        )
    }
}

WizardStep3.propTypes = {
    wizardData: PropTypes.object.isRequired,
    currentStepId: PropTypes.number.isRequired,
    setWizardData: PropTypes.func.isRequired,
    stores: PropTypes.object,
};

export default WizardStep3;

