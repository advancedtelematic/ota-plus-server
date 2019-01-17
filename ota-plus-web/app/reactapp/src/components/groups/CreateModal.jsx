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

const initialCurrentStepId = 0;

@inject('stores')
@observer
class CreateModal extends Component {
  @observable currentStepId = initialCurrentStepId;
  @observable steps = wizardSteps;
  @observable groupType = '';
  @observable groupFilters = {
    name: null,
    expression: null,
    word: '',
  };

  static propTypes = {
    stores: PropTypes.object,
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    selectGroup: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { groupsStore } = props.stores;
    this.createHandler = new AsyncStatusCallbackHandler(groupsStore, 'groupsCreateAsync', this.handleResponse.bind(this));
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

  selectGroupType = type => {
    this.groupType = type;
    this.markStepAsFinished();
  };

  /* toDo: investigate and simplify if possible */
  createGroup = () => {
    const { stores } = this.props;
    const { groupsStore } = stores;
    if (this.groupType === 'classic') {
      const data = serialize(document.querySelector('#classic-group-create-form'), { hash: true });
      groupsStore.createGroup({
        name: data.groupName,
        groupType: 'static',
        expression: null,
      });
    } else {
      const data = serialize(document.querySelector('#smart-group-create-form'), { hash: true });

      const expressionFilters = data.expressionFilter;
      let nameFilters = data.nameFilter;
      const wordFilters = data.word;
      let expressionToSend = '';
      if (typeof wordFilters === 'string') {
        if (nameFilters === 'device ID') {
          nameFilters = 'deviceid';
        }
        expressionToSend += `${nameFilters} ${expressionFilters} ${wordFilters}`.toLowerCase();
      } else {
        const filtersLength = wordFilters.length;

        for (let i = 0; i < filtersLength; i++) {
          if (nameFilters[i] === 'device ID') {
            nameFilters[i] = 'deviceid';
          }
          expressionToSend += `(${nameFilters[i]} ${expressionFilters[i]} ${wordFilters[i]})`.toLowerCase();
          if (i < filtersLength - 1) {
            expressionToSend += ' and ';
          }
        }
      }

      groupsStore.createGroup({
        name: data.groupName,
        groupType: 'dynamic',
        expression: expressionToSend,
      });
    }
  };

  handleResponse() {
    const { stores, selectGroup, hide } = this.props;
    const { groupsStore } = stores;
    let data = null;
    let isSmart = false;
    if (this.groupType === 'classic') {
      data = serialize(document.querySelector('#classic-group-create-form'), { hash: true });
    } else {
      data = serialize(document.querySelector('#smart-group-create-form'), { hash: true });
      isSmart = true;
      groupsStore.fetchExpressionForSelectedGroup(groupsStore.latestCreatedGroupId);
    }
    selectGroup({
      type: 'real',
      groupName: data.groupName,
      id: groupsStore.latestCreatedGroupId,
      isSmart,
    });
    groupsStore._prepareGroups(groupsStore.groups);
    hide();
  }

  render() {
    const { shown, hide } = this.props;
    const currentStep = this.steps[this.currentStepId];
    const step = (
      <span>
        {<currentStep.class selectGroupType={this.selectGroupType} groupType={this.groupType} markStepAsFinished={this.markStepAsFinished} markStepAsNotFinished={this.markStepAsNotFinished} />}
        <div className='body-actions'>
          {this.isLastStep() ? (
            <Button htmlType='button' className='btn-primary' id='wizard-launch-button' onClick={this.createGroup} disabled={!currentStep.isFinished}>
              Create
            </Button>
          ) : (
            <Button htmlType='button' disabled={!currentStep.isFinished} className='btn-primary' id='next' onClick={this.nextStep}>
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
          <div className='top-actions flex-end'>
            <div className='modal-close' onClick={hide}>
              <img src='/assets/img/icons/close.svg' alt='Icon' id='create-group-modal_close-icon' />
            </div>
          </div>
        }
        className='create-group-modal'
        content={step}
        visible={shown}
      />
    );
  }
}

export default CreateModal;
