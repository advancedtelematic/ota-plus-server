/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import Form from 'formsy-antd';
import { withTranslation } from 'react-i18next';
import { Button, notification, Tag } from 'antd';

import { OTAModal, Loader, SearchBar } from '../../partials';
import UpdateDetails from '../updates/UpdateDetails';
import {
  WizardStep1,
  WizardStep2,
  WizardStep3,
  WizardStep4,
  WizardStep5,
  WizardStep6,
  WizardStep7
} from './wizardSteps';
import { HTTP_CODE_400_BAD_REQUEST } from '../../constants/httpCodes';
import { CAMPAIGN_ERROR_CODE_WITHOUT_DEVICES } from '../../constants/campaignErrorCodes';

const initialCurrentStepId = 0;
const initialWizardData = {
  name: '',
  groups: [],
  update: [],
  metadata: [],
};

const initialFilterValue = null;

@inject('stores')
@observer
class Wizard extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    skipStep: PropTypes.string,
    minimizedWizards: PropTypes.arrayOf(PropTypes.shape({})),
    wizardIdentifier: PropTypes.number,
    hideWizard: PropTypes.func,
    t: PropTypes.func.isRequired,
    toggleWizard: PropTypes.func,
  };

  @observable currentStepId = initialCurrentStepId;

  @observable wizardSteps = [];

  @observable wizardData = initialWizardData;

  @observable filterValue = initialFilterValue;

  @observable currentDetails = null;

  @observable rawSelectedPacks = [];

  @observable approvalNeeded = false;

  versions = {};

  constructor(props) {
    super(props);
    const { t } = props;
    const { campaignsStore, featuresStore } = props.stores;

    const initialWizardStepForAlphaPlus = [
      {
        class: WizardStep1,
        name: 'name',
        title: t('campaigns.wizard.steps.select_name.title'),
        isFinished: false,
        isSearchBarShown: false,
        hasAlphaTag: false,
      },
      {
        class: WizardStep2,
        title: t('campaigns.wizard.steps.select_groups.title'),
        name: 'groups',
        isFinished: false,
        isSearchBarShown: false,
        hasAlphaTag: false,
      },
      {
        class: WizardStep3,
        name: 'updates',
        title: t('campaigns.wizard.steps.select_update.title'),
        isFinished: false,
        isSearchBarShown: false,
        hasAlphaTag: false,
      },
      {
        class: WizardStep4,
        title: t('campaigns.wizard.steps.user_consent.title'),
        name: 'metadata',
        isFinished: false,
        isSearchBarShown: false,
        hasAlphaTag: false,
      },
      {
        class: WizardStep5,
        title: t('campaigns.wizard.steps.dependencies_management.title'),
        name: 'dependencies-management',
        isFinished: false,
        isSearchBarShown: false,
        hasAlphaTag: true,
      },
      {
        class: WizardStep6,
        title: t('campaigns.wizard.steps.programming_sequencer.title'),
        name: 'programming-sequencer',
        isFinished: true,
        isSearchBarShown: false,
        hasAlphaTag: true,
      },
      {
        class: WizardStep7,
        title: t('campaigns.wizard.steps.summary.title'),
        name: 'summary',
        finishButtonLabel: 'Launch',
        isFinished: true,
        isSearchBarShown: false,
        hasAlphaTag: false,
      },
    ];

    const initialWizardStep = [
      {
        class: WizardStep1,
        name: 'name',
        title: t('campaigns.wizard.steps.select_name.title'),
        isFinished: false,
        isSearchBarShown: false,
      },
      {
        class: WizardStep2,
        title: t('campaigns.wizard.steps.select_groups.title'),
        name: 'groups',
        isFinished: false,
        isSearchBarShown: false,
      },
      {
        class: WizardStep3,
        name: 'updates',
        title: t('campaigns.wizard.steps.select_update.title'),
        isFinished: false,
        isSearchBarShown: false,
      },
      {
        class: WizardStep4,
        title: t('campaigns.wizard.steps.user_consent.title'),
        name: 'metadata',
        isFinished: false,
        isSearchBarShown: false,
      },
      {
        class: WizardStep7,
        title: 'Summary',
        name: 'summary',
        finishButtonLabel: t('campaigns.wizard.steps.launch.title'),
        isFinished: true,
        isSearchBarShown: false,
      },
    ];

    this.wizardSteps = featuresStore.alphaPlusEnabled ? initialWizardStepForAlphaPlus : initialWizardStep;

    this.campaignCreatedHandler = observe(campaignsStore, (change) => {
      if (change.name === 'campaignsCreateAsync' && change.object[change.name].isFetching === false) {
        const wizardMinimized = _.find(props.minimizedWizards, wizard => wizard.id === props.wizardIdentifier);
        if (!wizardMinimized) {
          if (change.object[change.name].code === HTTP_CODE_400_BAD_REQUEST
            && change.object[change.name].data.code === CAMPAIGN_ERROR_CODE_WITHOUT_DEVICES) {
            notification.error({
              message: t('campaigns.error_descriptions.campaign_without_devices_title'),
              description: t('campaigns.error_descriptions.campaign_without_devices'),
              duration: 6
            });
            const groupsStepIndex = this.wizardSteps.findIndex(step => step.name === 'groups');
            this.jumpToStep(groupsStepIndex);
          } else if (change.object[change.name].status !== 'error') {
            this.handleCampaignCreated();
          }
        }
      }
    });
  }

  componentWillMount() {
    const { stores, skipStep, wizardIdentifier } = this.props;
    const { groupsStore } = stores;
    const { selectedGroup } = groupsStore;

    if (skipStep) {
      this.wizardSteps = _.filter(this.wizardSteps, step => step.name !== skipStep);
      groupsStore.fetchDevicesForSelectedGroup(selectedGroup.id).then(() => {
        this.wizardData.groups = this.wizardData.groups.concat(selectedGroup);
      });
    }

    const matrixFromStorage = JSON.parse(localStorage.getItem(`matrix-${wizardIdentifier}`));
    if (matrixFromStorage) {
      localStorage.removeItem(`matrix-${wizardIdentifier}`);
    }
  }

  componentWillUnmount() {
    this.campaignCreatedHandler();
  }

  toggleFullScreen = (e) => {
    const { stores } = this.props;
    const { campaignsStore } = stores;
    if (e) e.preventDefault();
    if (!campaignsStore.fullScreenMode) {
      campaignsStore.showFullScreen();
    } else {
      campaignsStore.hideFullScreen();
    }
  };

  isFirstStep = () => this.currentStepId === 0;

  isLastStep = () => this.currentStepId === this.wizardSteps.length - 1;

  prevStep = () => {
    if (!this.isFirstStep()) {
      this.currentStepId = this.currentStepId - 1;
      this.filterValue = initialFilterValue;
    }
  };

  nextStep = () => {
    if (this.verifyIfPreviousStepsFinished(this.currentStepId) && !this.isLastStep()) {
      this.currentStepId = this.currentStepId + 1;
      this.filterValue = initialFilterValue;
    }
  };

  jumpToStep = (stepId, e) => {
    if (e) {
      e.preventDefault();
    }
    if (stepId < this.currentStepId || this.verifyIfPreviousStepsFinished(stepId - 1)) {
      this.currentStepId = stepId;
      this.filterValue = initialFilterValue;
    }
  };

  verifyIfPreviousStepsFinished = stepId => !_.find(
    this.wizardSteps,
    (step, index) => index <= stepId && step.isFinished === false
  );

  markStepAsFinished = () => {
    this.wizardSteps[this.currentStepId].isFinished = true;
  };

  markStepAsNotFinished = () => {
    this.wizardSteps[this.currentStepId].isFinished = false;
  };

  setWizardData = (data) => {
    Object.assign(this.wizardData, data);
  };

  setApprove = (boolean) => {
    this.approvalNeeded = boolean;
  };

  launch = () => {
    const { stores, wizardIdentifier } = this.props;
    const { campaignsStore } = stores;
    const { uuid: updateId } = _.first(this.wizardData.update);

    const metadata = this.metadataAsArray();

    const matrixFromStorage = JSON.parse(localStorage.getItem(`matrix-${wizardIdentifier}`));
    localStorage.removeItem(`matrix-${wizardIdentifier}`);
    localStorage.setItem(`matrix-${updateId}`, JSON.stringify(matrixFromStorage));

    const createData = {
      name: this.wizardData.name,
      update: updateId,
      groups: _.map(this.wizardData.groups, group => group.id),
      approvalNeeded: this.approvalNeeded,
    };

    if (!_.isEmpty(metadata)) {
      createData.metadata = metadata;
    }

    campaignsStore.createCampaign(createData);
  };

  handleCampaignCreated = () => {
    const { stores, wizardIdentifier, hideWizard } = this.props;
    const { campaignsStore } = stores;
    campaignsStore.launchCampaign(campaignsStore.campaignData.campaignId);
    hideWizard(wizardIdentifier);
    campaignsStore.fetchCampaigns(campaignsStore.activeTab, 'campaignsFetchAsync', 0);
    campaignsStore.fetchStatusCounts();
  };

  changeFilter = (filterValue) => {
    this.filterValue = filterValue;
  };

  showUpdateDetails = (update, e) => {
    if (e) {
      e.preventDefault();
    }
    this.currentDetails = update;
  };

  hideUpdateDetails = () => {
    this.currentDetails = null;
  };

  metadataAsArray = () => {
    const { metadata } = this.wizardData;
    const currentMetadata = [];

    _.each(metadata, (value, type) => {
      if (!_.isEmpty(value) && value !== '' && value !== '00') {
        currentMetadata.push({
          type,
          value,
        });
      }
    });

    return currentMetadata;
  };

  render() {
    const { stores, wizardIdentifier, hideWizard, toggleWizard, minimizedWizards, t } = this.props;
    const { campaignsStore, featuresStore } = stores;
    const { alphaPlusEnabled } = featuresStore;
    const currentStep = this.wizardSteps[this.currentStepId];

    const wizardMinimized = _.find(minimizedWizards, wizard => wizard.id === wizardIdentifier);

    const modalContent = this.currentDetails ? (
      <div className="campaigns-wizard">
        <div className="draggable-content">
          <div className="internal-body">
            <div className="content-step">
              <UpdateDetails updateItem={this.currentDetails} isEditable={false} />
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className={`campaigns-wizard campaigns-wizard-${wizardIdentifier}${campaignsStore.fullScreenMode ? ' full-screen' : ''}`}>
        <div className="draggable-content">
          <div className="internal-body">
            <div className="stepper">
              <div className="wrapper-steps-no">
                {_.map(this.wizardSteps, (step, index) => (
                  <div className={`step${this.currentStepId === index ? ' active' : ''}`} key={`wizard-step-${index}`}>
                    <button
                      type="button"
                      className="dot"
                      onClick={(e) => {
                        this.jumpToStep(index, e);
                      }}
                    >
                      {index + 1}
                    </button>
                    <div className="stepnum">{step.title}</div>
                    {(alphaPlusEnabled && step.hasAlphaTag) && <Tag color="#48dad0" className="alpha-tag">ALPHA</Tag>}
                  </div>
                ))}
              </div>
            </div>
            <div className={`content-step step-${currentStep.name}`}>
              {campaignsStore.campaignsSingleFetchAsync.isFetching ? (
                <div className="wrapper-center">
                  <Loader />
                </div>
              ) : (
                <currentStep.class
                  campaign={{}}
                  setWizardData={this.setWizardData}
                  setApprove={this.setApprove}
                  currentStepId={this.currentStepId}
                  wizardData={this.wizardData}
                  markStepAsFinished={this.markStepAsFinished}
                  markStepAsNotFinished={this.markStepAsNotFinished}
                  filterValue={this.filterValue}
                  selectVersion={this.selectVersion}
                  wizardIdentifier={wizardIdentifier}
                  rawSelectedPacks={this.rawSelectedPacks}
                  approvalNeeded={this.approvalNeeded}
                  alphaPlus={featuresStore.alphaPlusEnabled}
                  alphaTest={featuresStore.alphaTestEnabled}
                  showUpdateDetails={this.showUpdateDetails}
                />
              )}
              {currentStep.isSearchBarShown && (
                <Form>
                  <SearchBar value={this.filterValue} changeAction={this.changeFilter} id="wizard-search-package" />
                </Form>
              )}
            </div>
            <div className="body-actions">
              <div className="wrapper-confirm">
                {this.isLastStep() ? (
                  <Button
                    htmlType="button"
                    className="btn-primary btn-red"
                    id="wizard-launch-button"
                    onClick={this.launch}
                    disabled={!currentStep.isFinished}
                  >
                    Launch
                  </Button>
                ) : (
                  <Button
                    htmlType="button"
                    className="btn-primary"
                    id="next-step"
                    onClick={this.nextStep}
                    disabled={!currentStep.isFinished}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div id="dropdown-render" />
      </div>
    );
    return (
      <OTAModal
        title={
          !this.currentDetails ? t('campaigns.wizard.add_new_campaign') : t('campaigns.wizard.campaign_update_details')
        }
        topActions={(
          <div className="top-actions">
            <div
              className="wizard-minimize"
              onClick={toggleWizard.bind(this, wizardIdentifier, this.wizardData.name)}
              id="minimize-wizard"
            >
              <img src="/assets/img/icons/minimize.svg" alt="Icon" />
            </div>
            <div className={`toggle-fullscreen${campaignsStore.fullScreenMode ? ' on' : ' off'}`} onClick={this.toggleFullScreen}>
              {campaignsStore.fullScreenMode ? (
                <img src="/assets/img/icons/exit-fullscreen.svg" alt="Icon" id="exit-fullscreen-wizard" />
              ) : (
                <img src="/assets/img/icons/maximize.svg" alt="Icon" id="enter-fullscreen-wizard" />
              )}
            </div>
            <div
              id="close-wizard"
              className="wizard-close"
              onClick={(e) => {
                if (this.currentDetails) this.hideUpdateDetails();
                else hideWizard(wizardIdentifier, e);
              }}
            >
              <img src="/assets/img/icons/close.svg" alt="Icon" />
            </div>
          </div>
)}
        content={modalContent}
        visible={!wizardMinimized}
        onRequestClose={() => {
          toggleWizard(this, wizardIdentifier, this.wizardData.name);
        }}
        className={`dialog-campaign-wizard ${campaignsStore.fullScreenMode ? 'full-screen' : ''} ${campaignsStore.transitionsEnabled ? '' : ' disable-transitions'}`}
      />
    );
  }
}

export default withTranslation()(Wizard);
