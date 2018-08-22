import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Modal, AsyncResponse, Loader, FormSelect, FormInput, FormTextarea } from '../../partials';
import { Form } from 'formsy-react';
import { FormsyText } from 'formsy-material-ui/lib';
import { FlatButton, SelectField, MenuItem } from 'material-ui';
import serialize from 'form-serialize';
import _ from 'underscore';
import Step1 from './createWizard/Step1';
import Step2 from './createWizard/Step2';
import { AsyncStatusCallbackHandler } from '../../utils';

const wizardSteps = [
    {
        class: Step1,
        isFinished: false,
    },
    {
        class: Step2,
        isFinished: false,
    },
];

const data = [
    {
        name: '',
        description: '',
        hardwareIds: [],
    },
    {
        updates: {}        
    }
];

const initialCurrentStepId = 0;

@inject("stores")
@observer
class CreateModal extends Component {
    @observable wizardData = data;
    @observable steps = wizardSteps;
    @observable currentStepId = initialCurrentStepId;

    constructor(props) {
        super(props);
        const { updateStore } = props.stores;
        this.mtuCreatedHandler = new AsyncStatusCallbackHandler(updateStore, 'updatesMtuCreateAsync', this.handleMtuCreated.bind(this));
        this.updateCreatedHandler = new AsyncStatusCallbackHandler(updateStore, 'updatesCreateAsync', this.handleUpdateCreated.bind(this));
    }

    componentWillMount() {
        const { editMode } = this.props;
        if(editMode) {
            this.currentStepId = 1;
        }
    }

    componentWillUnmount() {
        this.mtuCreatedHandler();
        this.updateCreatedHandler();
    }

    markStepAsFinished = () => {
        this.steps[this.currentStepId].isFinished = true;
    }

    markStepAsNotFinished = () => {
        this.steps[this.currentStepId].isFinished = false;
    }

    verifyIfPreviousStepsFinished = (stepId) => {
        if (_.find(this.steps, function (step, index) {
                return index <= stepId && step.isFinished === false;
            }))
            return false;
        return true;
    }

    isLastStep = () => {
        return this.currentStepId == this.steps.length - 1;
    }

    nextStep = () => {
        if (this.verifyIfPreviousStepsFinished(this.currentStepId) && this.currentStepId != this.steps.length - 1) {
            this.currentStepId = this.currentStepId + 1;
        }
    }

    prevStep = () => {
        if (this.currentStepId != 0) {
            this.currentStepId = this.currentStepId - 1;
        }
    }

    createMtu = () => {
        const { updateStore } = this.props.stores;
        updateStore.createMultiTargetUpdate(this.wizardData[1].updates);
    }

    handleMtuCreated = () => {
        const { updateStore } = this.props.stores;
        const { lastCreatedMtuId } = updateStore;
        const data = {
            updateSource: {
                id: lastCreatedMtuId,
                sourceType: "multi_target"
            },
            name: this.wizardData[0].name,
            description: this.wizardData[0].description,
        }
        updateStore.createUpdate(data);
    }

    handleUpdateCreated = () => {
        this.props.hide();
    }

    onStep1DataSelect = (type, value) => {
        const stepData = this.wizardData[this.currentStepId];
        switch(type) {
            case 'hardwareId':
                let hardwareIds = stepData.hardwareIds;
                if(_.includes(hardwareIds, value))
                    hardwareIds.splice(hardwareIds.indexOf(value), 1);
                else
                    hardwareIds.push(value);
                break;
            case 'name':
                stepData.name = value;
                break;
            case 'description':
                stepData.description = value;
                break;
            default:
                break;
        }
        if(stepData.hardwareIds.length && 
            stepData.name !== '' && 
            stepData.description !== '') {
                this.markStepAsFinished();
        } else {
            this.markStepAsNotFinished();
        }
    }

    onStep2DataSelect = (hardwareId, type, value) => {
        const { editMode } = this.props;
        const stepData = this.wizardData[this.currentStepId].updates;
        stepData[hardwareId] = !_.isUndefined(stepData[hardwareId]) ? stepData[hardwareId] : {};
        stepData[hardwareId][type] = value;
        if(type === 'fromPack') {
            stepData[hardwareId]['fromVersion'] = null;
        }
        if(type === 'toPack') {
            stepData[hardwareId]['toVersion'] = null;
        }
        _.each(this.wizardData[0].hardwareIds, id => {
            if(stepData[id] && 
                stepData[id].fromPack &&
                stepData[id].toPack &&
                stepData[id].fromVersion &&
                stepData[id].toVersion &&
                !editMode) {
                    this.markStepAsFinished();
            } else {
                this.markStepAsNotFinished();
            }
        });
    }

    render() {
        const { shown, hide, editMode } = this.props;
        const currentStep = this.steps[this.currentStepId];
        const step = (
            <span>
                {React.createElement(currentStep.class, {
                    wizardData: this.wizardData,
                    onStep1DataSelect: this.onStep1DataSelect,
                    onStep2DataSelect: this.onStep2DataSelect,
                })}
                <div className="body-actions" style={{margin: 0}}>
                    {this.isLastStep() ?
                        <div style={{display: 'flex'}}>
                            {!editMode ?
                                <button
                                    className="btn-primary"
                                    id="wizard-back-button"
                                    onClick={this.prevStep}
                                    style={{marginRight: '10px'}}
                                >
                                    Back
                                </button>
                            :
                                null
                            }
                            
                            <button
                                className="btn-primary"
                                id="wizard-launch-button"
                                disabled={!currentStep.isFinished}
                                onClick={this.createMtu}
                            >
                                Save
                            </button>
                        </div>
                    :
                        <button
                            disabled={!currentStep.isFinished}
                            className="btn-primary"
                            id="next"
                            onClick={this.nextStep}
                        >
                            Continue
                        </button>
                    }
                </div>
            </span>
        );
        return (
            <Modal
                title={editMode ? "Edit update" : "Create new update"}
                topActions={
                    <div className="top-actions flex-end">
                        <div className="modal-close" onClick={hide}>
                            <img src="/assets/img/icons/close.svg" alt="Icon"/>
                        </div>
                    </div>
                }
                content={step}
                shown={shown}
                className="create-update-modal"
            />
        );
    }
}

CreateModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    stores: PropTypes.object,
};

export default CreateModal;