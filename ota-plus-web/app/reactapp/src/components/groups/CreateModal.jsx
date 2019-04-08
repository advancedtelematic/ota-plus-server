/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import serialize from 'form-serialize';
import _ from 'lodash';
import { Button } from 'antd';

import { OTAModal } from '../../partials';
import { AsyncStatusCallbackHandler } from '../../utils';
import { Step1, Step2 } from './createWizard';

const wizardSteps = [
  {
    class: Step1,
    name: 'Choose group type',
    isFinished: false,
  },
  {
    class: Step2,
    name: 'Pass group data',
    isFinished: false,
  },
];

const initialData = {
  groupName: '',
  groupType: '',
  smartExpression: '',
};

const initialCurrentStepId = 0;

@inject('stores')
@observer
class CreateModal extends Component {
  @observable wizardData = initialData;
  @observable currentStepId = initialCurrentStepId;
  @observable steps = wizardSteps;

  static propTypes = {
    stores: PropTypes.object,
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    selectGroup: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { groupsStore } = props.stores;
    this.createHandler = new AsyncStatusCallbackHandler(groupsStore, 'groupsCreateAsync', this.handleGroupCreated.bind(this));
  }

  componentWillUnmount() {
    this.createHandler();
  }

  markStepAsFinished = () => {
    this.steps[this.currentStepId].isFinished = true;
  };

  markStepAsNotFinished = () => {
    this.steps[this.currentStepId].isFinished = false;
  };

  verifyIfPreviousStepsFinished = stepId => !_.find(this.steps, (step, index) => index <= stepId && step.isFinished === false);

  isLastStep = () => this.currentStepId === this.steps.length - 1;

  nextStep = () => {
    if (this.verifyIfPreviousStepsFinished(this.currentStepId) && !this.isLastStep()) {
      this.currentStepId = this.currentStepId + 1;
    }
  };

  prevStep = () => {
    if (this.currentStepId !== 0) {
      this.currentStepId = this.currentStepId - 1;
    }
    this.validateStep(this.currentStepId);
  };

  createGroup = () => {
    const { groupName, groupType, smartExpression } = this.wizardData;

    const { groupsStore } = this.props.stores;
    if (groupType === 'classic') {
      groupsStore.createGroup({
        name: groupName,
        groupType: 'static',
        expression: null,
      });
    } else {
      let data = serialize(document.querySelector('#smart-group-create-form'), { hash: true });
      groupsStore.createGroup({
        name: groupName,
        groupType: 'dynamic',
        expression: smartExpression,
      });
    }
  };

  handleGroupCreated() {
    const { groupName, groupType } = this.wizardData;

    const { groupsStore } = this.props.stores;
    let data = null;
    let isSmart = false;
    if (groupType === 'classic') {
      data = serialize(document.querySelector('#classic-group-create-form'), { hash: true });
    } else {
      isSmart = true;
      groupsStore.fetchExpressionForSelectedGroup(groupsStore.latestCreatedGroupId);
    }
    this.props.selectGroup({ type: 'real', groupName, id: groupsStore.latestCreatedGroupId, isSmart });
    groupsStore._prepareGroups(groupsStore.groups);
    this.props.hide();
  }

  validateStep = (id) => {
    const { groupName, groupType, smartExpression } = this.wizardData;

    switch (id) {
      case 0:
        if (groupType !== '') {
          this.markStepAsFinished();
        } else {
          this.markStepAsNotFinished();
        }
        break;
      case 1:
        if ((groupType === 'classic' && groupName !== '') || (groupType === 'smart' && groupName !== '' && smartExpression !== '')) {
          this.markStepAsFinished();
        } else {
          this.markStepAsNotFinished();
        }
        break;
      default:
        break;
    }
  };

  onStep1DataSelect = (type) => {
    this.wizardData.groupType = type;
    this.validateStep(this.currentStepId);
  };

  onStep2DataSelect = (type, data) => {
    switch (type) {
      case 'name':
        this.wizardData.groupName = data;
        break;
      case 'expression':
        this.wizardData.smartExpression = data;
        break;
      default:
        break;
    }

    this.validateStep(this.currentStepId);
  };

  render() {
    const { shown, hide } = this.props;
    const currentStep = this.steps[this.currentStepId];
    const step = (
      <span>
        {<currentStep.class groupType={this.wizardData.groupType} onStep1DataSelect={this.onStep1DataSelect} onStep2DataSelect={this.onStep2DataSelect} />}
        <div className="body-actions">
          {this.isLastStep() ? (
            <Button
              htmlType="button"
              className="btn-primary pull-right"
              id="wizard-launch-butto"
              disabled={!currentStep.isFinished}
              onClick={this.createGroup}
            >
              {'Create'}
            </Button>
          ) : (
            <Button
              htmlType="button"
              disabled={!currentStep.isFinished}
              className="btn-primary"
              id="next"
              onClick={this.nextStep}
            >
              Next
            </Button>
          )}
        </div>
      </span>
    );
    return (
      <OTAModal
        title={<div>Create new group</div>}
        topActions={
          <div className="top-actions flex-end">
            <div className="modal-close" onClick={hide}>
              <img src="/assets/img/icons/close.svg" alt="Icon" id="create-group-modal_close-icon" />
            </div>
          </div>
        }
        className="create-group-modal"
        content={step}
        visible={shown}
      />
    );
  }
}

export default CreateModal;
