/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import serialize from 'form-serialize';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import { Button, ModalTitleWrapper, OTAModal } from '../../partials';
import { AsyncStatusCallbackHandler } from '../../utils';
import { Step1, Step2 } from './createWizard';
import {
  GROUP_DATA_TYPE_EXPRESSION,
  GROUP_DATA_TYPE_FILE,
  GROUP_DATA_TYPE_NAME,
  GROUP_GROUP_TYPE_CLASSIC,
  GROUP_GROUP_TYPE_DYNAMIC,
  GROUP_GROUP_TYPE_SMART,
  GROUP_GROUP_TYPE_STATIC
} from '../../constants/groupConstants';
import { sendAction } from '../../helpers/analyticsHelper';
import { OTA_DEVICES_CREATE_SMART_GROUP, OTA_DEVICES_CREATE_FIXED_GROUP } from '../../constants/analyticsActions';
import { assets, GROUP_ICON_GRAY, CLOSE_MODAL_ICON } from '../../config';
import {
  ButtonsWrapper,
  ModalTitle,
  StyledButton,
  StyledOTAModal
} from './createWizard/step2/smartGroup/SmartGroupWizard/styled';

const SMART_GROUP_MODAL_WIDTH = '818px';

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
  file: undefined,
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
    stores: PropTypes.shape({}),
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    selectGroup: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const { groupsStore } = props.stores;
    this.createHandler = new AsyncStatusCallbackHandler(
      groupsStore,
      'groupsCreateAsync',
      this.handleGroupCreated.bind(this)
    );
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

  verifyIfPreviousStepsFinished = stepId => !_.find(
    this.steps, (step, index) => index <= stepId && step.isFinished === false
  );

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
    const { file, groupName, groupType, smartExpression } = this.wizardData;
    const { stores } = this.props;
    const { groupsStore } = stores;
    if (groupType === GROUP_GROUP_TYPE_CLASSIC) {
      if (file) {
        groupsStore.createGroupWithFileData({
          name: groupName,
          file
        });
      } else {
        groupsStore.createGroup({
          name: groupName,
          groupType: GROUP_GROUP_TYPE_STATIC,
          expression: null,
        });
      }
      sendAction(OTA_DEVICES_CREATE_FIXED_GROUP);
    } else {
      // eslint-disable-next-line no-unused-vars
      const data = serialize(document.querySelector('#smart-group-create-form'), { hash: true });
      groupsStore.createGroup({
        name: groupName,
        groupType: GROUP_GROUP_TYPE_DYNAMIC,
        expression: smartExpression,
      });
      sendAction(OTA_DEVICES_CREATE_SMART_GROUP);
    }
  };

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
        if (
          (groupType === GROUP_GROUP_TYPE_CLASSIC && groupName !== '')
          || (groupType === GROUP_GROUP_TYPE_SMART && groupName !== '' && smartExpression !== '')
        ) {
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
      case GROUP_DATA_TYPE_FILE:
        this.wizardData.file = data;
        break;
      case GROUP_DATA_TYPE_NAME:
        this.wizardData.groupName = data;
        break;
      case GROUP_DATA_TYPE_EXPRESSION:
        this.wizardData.smartExpression = data;
        break;
      default:
        break;
    }
    this.validateStep(this.currentStepId);
  };

  handleGroupCreated() {
    const { groupName, groupType } = this.wizardData;
    const { stores, selectGroup, hide } = this.props;
    const { groupsStore } = stores;
    // eslint-disable-next-line no-unused-vars
    let data = null;
    let isSmart = false;
    if (groupType === GROUP_GROUP_TYPE_CLASSIC) {
      data = serialize(document.querySelector('#classic-group-create-form'), { hash: true });
    } else {
      isSmart = true;
      groupsStore.fetchExpressionForSelectedGroup(groupsStore.latestCreatedGroupId);
    }
    selectGroup({ type: 'real', groupName, id: groupsStore.latestCreatedGroupId, isSmart });
    groupsStore.prepareGroups(groupsStore.groups);
    hide();
  }

  render() {
    const { shown, hide, t } = this.props;
    const { groupType } = this.wizardData;
    const currentStep = this.steps[this.currentStepId];
    const step = (
      <span>
        {<currentStep.class
          groupType={this.wizardData.groupType}
          onStep1DataSelect={this.onStep1DataSelect}
          onStep2DataSelect={this.onStep2DataSelect}
        />}
        {!(groupType === GROUP_GROUP_TYPE_SMART && this.isLastStep()) ? (
          <div className="body-actions">
            {this.isLastStep() ? (
              <Button
                light="true"
                type="primary"
                className="pull-right"
                id="wizard-launch-butto"
                disabled={!currentStep.isFinished}
                onClick={this.createGroup}
              >
                {t('groups.creating.buttons.create')}
              </Button>
            ) : (
              <Button
                light="true"
                type="primary"
                disabled={!currentStep.isFinished}
                id="next"
                onClick={this.nextStep}
              >
                {t('groups.creating.next')}
              </Button>
            )}
          </div>
        ) : (
          <ButtonsWrapper>
            <StyledButton
              light="true"
              id="wizard-cancel-butto"
              onClick={hide}
            >
              {t('groups.creating.buttons.cancel')}
            </StyledButton>
            <StyledButton
              light="true"
              type="primary"
              id="wizard-launch-butto"
              disabled={!currentStep.isFinished}
              onClick={this.createGroup}
            >
              {t('groups.creating.buttons.create')}
            </StyledButton>
          </ButtonsWrapper>
        )}
      </span>
    );
    return this.isLastStep() && groupType === GROUP_GROUP_TYPE_SMART ? (
      <StyledOTAModal
        title={(
          <ModalTitle>
            {t('groups.creating.create-new-group')}
          </ModalTitle>
        )}
        topActions={<img src={CLOSE_MODAL_ICON} onClick={hide} />}
        width={SMART_GROUP_MODAL_WIDTH}
        className="create-group-modal"
        content={step}
        visible={shown}
      />
    ) : (
      <OTAModal
        title={(
          <ModalTitleWrapper>
            {this.isLastStep() && (
              <img src={GROUP_ICON_GRAY} />
            )}
            {t('groups.creating.create-new-group')}
          </ModalTitleWrapper>
        )}
        topActions={(
          <div className="top-actions flex-end">
            <div className="modal-close" onClick={hide}>
              <img src={assets.DEFAULT_CLOSE_ICON} alt="Icon" id="create-group-modal_close-icon" />
            </div>
          </div>
        )}
        className="create-group-modal"
        content={step}
        visible={shown}
      />
    );
  }
}

export default withTranslation()(CreateModal);
