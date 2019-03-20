/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';

import { Button } from 'antd';
import { OTAModal } from '../../partials';

import { contains } from '../../utils/Helpers';
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

const initialData = {
  name: '',
  description: '',
  selectedHardwares: [],
  update: {}
};

const initialCurrentStepId = 0;

@inject('stores')
@observer
class CreateModal extends Component {
  @observable wizardData = initialData;
  @observable steps = wizardSteps;
  @observable currentStepId = initialCurrentStepId;
  markStepAsFinished = () => {
    this.steps[this.currentStepId].isFinished = true;
  };
  markStepAsNotFinished = () => {
    this.steps[this.currentStepId].isFinished = false;
  };
  verifyIfPreviousStepsFinished = stepId => !_.find(this.steps, (step, index) => index <= stepId && !step.isFinished);
  isLastStep = () => this.currentStepId === this.steps.length - 1;
  nextStep = () => {
    if (this.verifyIfPreviousStepsFinished(this.currentStepId) && this.currentStepId !== this.steps.length - 1) {
      this.currentStepId = this.currentStepId + 1;
    }
    this.validateStep(this.currentStepId);
  };
  prevStep = () => {
    if (this.currentStepId !== 0) {
      this.currentStepId = this.currentStepId - 1;
    }
    this.validateStep(this.currentStepId);
  };
  createMtu = () => {
    const { stores } = this.props;
    const { updatesStore } = stores;
    updatesStore.createMultiTargetUpdate(this.wizardData.update);
  };
  handleMtuCreated = () => {
    const { stores } = this.props;
    const { updatesStore } = stores;
    const { lastCreatedMtuId } = updatesStore;

    const updateData = {
      updateSource: {
        id: lastCreatedMtuId,
        sourceType: 'multi_target',
      },
      name: this.wizardData.name,
      description: this.wizardData.description,
    };
    updatesStore.createUpdate(updateData);
  };
  handleUpdateCreated = () => {
    const { hide } = this.props;
    hide();
  };
  validateStep = id => {
    const { showDetails } = this.props;
    const { name, description, selectedHardwares, update } = this.wizardData;

    switch (id) {
      case 0:
        if (selectedHardwares.length && name !== '' && description !== '') {
          this.markStepAsFinished();
        } else {
          this.markStepAsNotFinished();
        }
        break;
      case 1:
        _.each(selectedHardwares, item => {
          if (!showDetails &&
              update &&
              update[item.name] &&
              update[item.name].fromPack &&
              update[item.name].toPack &&
              (update[item.name].updateFromAny || update[item.name].fromVersion) &&
              update[item.name].toVersion) {
            this.markStepAsFinished();
          } else {
            this.markStepAsNotFinished();
          }
        });
        break;
      default:
        break;
    }
  };
  onStep1DataSelect = (type, data) => {
    const hardwares = this.wizardData.selectedHardwares;
    const { update } = this.wizardData;
    switch (type) {
      case 'hardwareId':
        if (contains(hardwares, data, 'hardware')) {
          this.wizardData.selectedHardwares = _.reject(hardwares, item => item.name === data.name);
          this.wizardData.update = _.omit(update, data.name);
        } else {
          this.wizardData.selectedHardwares.push(data);
        }
        break;
      case 'name':
        this.wizardData.name = data;
        break;
      case 'description':
        this.wizardData.description = data;
        break;
      default:
        break;
    }
    this.validateStep(this.currentStepId);
  };
  onStep2DataSelect = (selected, type, value) => {
    const { name: hardwareId } = selected;
    const { update } = this.wizardData;
    update[hardwareId] = _.isObject(update[hardwareId]) ? update[hardwareId] : {};
    update[hardwareId][type] = value;

    if (type === 'fromPack') {
      update[hardwareId].fromVersion = null;
    }
    if (type === 'toPack') {
      update[hardwareId].toVersion = null;
    }
    this.validateStep(this.currentStepId);
  };

  constructor(props) {
    super(props);
    const { updatesStore } = props.stores;
    this.mtuCreatedHandler = new AsyncStatusCallbackHandler(updatesStore, 'updatesMtuCreateAsync', this.handleMtuCreated.bind(this));
    this.updateCreatedHandler = new AsyncStatusCallbackHandler(updatesStore, 'updatesCreateAsync', this.handleUpdateCreated.bind(this));
  }

  componentWillMount() {
    const { showDetails } = this.props;
    if (showDetails) {
      this.currentStepId = 1;
    }
  }

  componentWillUnmount() {
    this.mtuCreatedHandler();
    this.updateCreatedHandler();
  }

  render() {
    const { shown, hide, showDetails } = this.props;
    const currentStep = this.steps[this.currentStepId];
    const step = (
      <span>
        {<currentStep.class wizardData={this.wizardData} onStep1DataSelect={this.onStep1DataSelect} onStep2DataSelect={this.onStep2DataSelect} showDetails={showDetails} />}
        <div className='body-actions' style={{ margin: 0 }}>
          {this.isLastStep() ? (
            !showDetails && (
              <div style={{ display: 'flex' }}>
                <Button htmlType='button' className='btn-primary' id='wizard-back-button' onClick={this.prevStep} style={{ marginRight: '10px' }}>
                  {'Back'}
                </Button>
                <Button htmlType='button' className='btn-primary pull-right' id='wizard-launch-button' disabled={!currentStep.isFinished} onClick={this.createMtu}>
                  {'Save'}
                </Button>
              </div>
            )
          ) : (
            <Button htmlType='button' disabled={!currentStep.isFinished} className='btn-primary' id='next' onClick={this.nextStep}>
              {'Continue'}
            </Button>
          )}
        </div>
      </span>
    );
    return (
      <OTAModal
        title={showDetails ? 'Update details' : 'Create new update'}
        topActions={
          <div className='top-actions flex-end'>
            <div className='modal-close' id='close-update-modal' onClick={hide}>
              <img src='/assets/img/icons/close.svg' alt='Icon' />
            </div>
          </div>
        }
        content={step}
        visible={shown}
        className='create-update-modal'
      />
    );
  }
}

CreateModal.propTypes = {
  shown: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  showDetails: PropTypes.object,
  stores: PropTypes.object,
};

export default CreateModal;
