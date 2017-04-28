import React, { Component, PropTypes } from 'react';
import { observable, observe } from "mobx"
import { observer } from 'mobx-react';
import { FlatButton } from 'material-ui';
import _ from 'underscore';
import { Form } from 'formsy-react';
import { AsyncStatusCallbackHandler } from '../../utils';
import { Modal, Loader, SearchBar } from '../../partials';
import { 
    WizardStep1,
    WizardStep2,
    WizardStep3,
    WizardStep4
} from './wizard';

const initialCurrentStepId = 0;
const initialWizardData = [
    {
        package: {
            name: null,
            version: null,
        }
    },
    {
        groups: [],
    },
    {
        isActivated: false,
    },
];
const initialWizardStep = [
    {
        class: WizardStep1,
        name: "packages",
        title: "Select Package",
        isFinished: false,
        isSearchBarShown: true,
    },
    {
        class: WizardStep2,
        title: "Select Group(s)",
        name: "groups",
        isFinished: false,
        isSearchBarShown: false,
    },
    {
        class: WizardStep3,
        title: "Delta switch",
        name: "delta",
        isFinished: true,
        isSearchBarShown: false,
    },
    {
        class: WizardStep4,
        title: "Summary",
        name: "summary",
        finishButtonLabel: "Launch",
        isFinished: true,
        isSearchBarShown: false,
    },
];

const initialFilterValue = null;
let asyncActionsLeftCounter = 2;
let waitingForLaunch = false;

@observer
class Wizard extends Component {
    @observable currentStepId = initialCurrentStepId;
    @observable wizardSteps = initialWizardStep;
    @observable wizardData = initialWizardData;
    @observable filterValue = initialFilterValue;

    constructor(props) {
        super(props);
        this.isFirstStep = this.isFirstStep.bind(this);
        this.isLastStep = this.isLastStep.bind(this);
        this.prevStep = this.prevStep.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.jumpToStep = this.jumpToStep.bind(this);
        this.verifyIfPreviousStepsFinished = this.verifyIfPreviousStepsFinished.bind(this);
        this.markStepAsFinished = this.markStepAsFinished.bind(this);
        this.markStepAsNotFinished = this.markStepAsNotFinished.bind(this);
        this.setWizardData = this.setWizardData.bind(this);
        this.saveData = this.saveData.bind(this);
        this.close = this.close.bind(this);
        this.launch = this.launch.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.handleLaunchResponse = this.handleLaunchResponse.bind(this);
        this.handleSaveDataResponse = this.handleSaveDataResponse.bind(this);
        this.hide = this.hide.bind(this);
        this.fetchHandler = observe(props.campaignsStore, (change) => {
            const newValue = change.object[change.name];
            if(change.name === 'campaign' && _.isEmpty(change.oldValue) && !_.isMatch(change.oldValue, newValue)) {
                if(newValue.packageId.name && newValue.packageId.version) {
                    this.wizardData[0].package = {
                        name: newValue.packageId.name,
                        version: newValue.packageId.version
                    }
                    this.wizardSteps[0].isFinished = true;
                }
                if(newValue.groups.length) {
                    _.each(newValue.groups, (group) => {
                        this.wizardData[1].groups.push(group.group);
                    });
                    this.wizardSteps[1].isFinished = true;
                }
            }
        });
        this.launchHandler = new AsyncStatusCallbackHandler(props.campaignsStore, 'campaignsLaunchAsync', this.handleLaunchResponse);
        this.packageSaveHandler = new AsyncStatusCallbackHandler(props.campaignsStore, 'campaignsPackageSaveAsync', this.handleSaveDataResponse);
        this.groupsSaveHandler = new AsyncStatusCallbackHandler(props.campaignsStore, 'campaignsGroupsSaveAsync', this.handleSaveDataResponse);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.campaignId && nextProps.campaignId !== this.props.campaignId)
            this.props.campaignsStore.fetchCampaign(nextProps.campaignId);
    }
    componentWillUnmount() {
        this.launchHandler();
        this.packageSaveHandler();
        this.groupsSaveHandler();
    }
    isFirstStep() {
        return this.currentStepId == 0;
    }
    isLastStep() {
        return this.currentStepId == this.wizardSteps.length - 1;
    }
    prevStep() {
        if(this.currentStepId != 0) {
            currentStepId = this.currentStepId - 1;
            this.filterValue = initialFilterValue;
        }
    }
    nextStep() {
        if(this.verifyIfPreviousStepsFinished(this.currentStepId) && this.currentStepId != this.wizardSteps.length - 1) {
            this.currentStepId = this.currentStepId + 1;
            this.filterValue = initialFilterValue;
        }
    }
    jumpToStep(stepId, e) {
        e.preventDefault();
          if(stepId < this.currentStepId || this.verifyIfPreviousStepsFinished(stepId - 1)) {
            this.currentStepId = stepId;
            this.filterValue = initialFilterValue;
          }
    }
    verifyIfPreviousStepsFinished(stepId) {
        if(_.find(this.wizardSteps, function(step, index) {
            return index <= stepId && step.isFinished === false;
        }))    
            return false;
        return true;
    }
    markStepAsFinished() {
        this.wizardSteps[this.currentStepId].isFinished = true;
    }
    markStepAsNotFinished() {
        this.wizardSteps[this.currentStepId].isFinished = false;
    }
    setWizardData(data) {
        this.wizardData[this.currentStepId] = data;
    }
    saveData() {
        asyncActionsLeftCounter = 2;
        if(this.wizardData[1].groups.length) {
            this.props.campaignsStore.saveGroupsForCampaign(this.props.campaignId, this.wizardData[1]);
        } else {
            asyncActionsLeftCounter--;
        }
        if(this.wizardData[0].package.name && this.wizardData[0].package.version) {
            this.props.campaignsStore.savePackageForCampaign(this.props.campaignId, this.wizardData[0].package);
        } else {
            asyncActionsLeftCounter--;
        }
        if(asyncActionsLeftCounter === 0)
            this.hide();
    }
    close(e) {
        if(e) e.preventDefault();
        this.saveData();
    }
    launch() {
        waitingForLaunch = true;
        this.saveData();
    }
    changeFilter(filterValue) {
        this.filterValue = filterValue;
    }
    handleLaunchResponse() {
        this.hide();
    }
    handleSaveDataResponse() {
        asyncActionsLeftCounter--;
        if(asyncActionsLeftCounter == 0)
            waitingForLaunch ? 
                this.props.campaignsStore.launchCampaign(this.props.campaignId) 
            : 
                this.hide();
    }
    hide() {
        this.props.hide();
        this.props.campaignsStore._resetWizard();
        this.props.packagesStore._resetWizard();
        this.currentStepId = initialCurrentStepId;
        this.wizardData = initialWizardData;
        this.wizardSteps = initialWizardStep;
        this.filterValue = initialFilterValue;
        asyncActionsLeftCounter = 2;
        waitingForLaunch = false;
    }
    render() {
        const { shown, hide, campaignsStore, packagesStore, groupsStore } = this.props;
        const currentStep = this.wizardSteps[this.currentStepId];
          const modalContent = (
              <span>
                  <div className={"content-step step-" + currentStep.name}>
                      {campaignsStore.campaignsOneFetchAsync.isFetching ?
                          <div className="wrapper-center">
                            <Loader />
                        </div>
                      :
                          React.createElement(currentStep.class, {
                            campaign: {},
                            setWizardData: this.setWizardData,
                            wizardData: this.wizardData,
                            markStepAsFinished: this.markStepAsFinished,
                            markStepAsNotFinished: this.markStepAsNotFinished,
                            filterValue: this.filterValue,
                            packagesStore: packagesStore,
                            groupsStore: groupsStore
                          })
                      }
                      {currentStep.isSearchBarShown ?
                          <Form>
                            <SearchBar 
                                value={this.filterValue}
                                changeAction={this.changeFilter}
                                id="wizard-search-package"
                            />
                        </Form>
                      :
                          null
                      }
                  </div>
                  <div className="actions">
                      <div className="wrapper-close">
                          <a href="#" className="link-close" id="save-and-close" onClick={this.close}>
                              Save & Close
                          </a>
                      </div>
                      <div className="wrapper-steps-no">
                        {_.map(this.wizardSteps, (step, index) => {
                            return (
                                  <div className={"step" + (this.currentStepId == index ? " active" : "")} key={'wizard-step-' + index}>
                                    <div className="progress">
                                        <div className="progress-bar"></div>
                                    </div>
                                    <a href="#" className="dot" onClick={this.jumpToStep.bind(this, index)}>
                                        {index+1}
                                    </a>
                                    <div className="stepnum">
                                        {step.title}
                                    </div>
                                  </div>
                            );
                        }, this)}
                    </div>
                    <div className="wrapper-confirm">
                        {this.isLastStep() ? 
                            <FlatButton
                                label="Launch"
                                className="btn-main btn-red"
                                id="wizard-launch-button"
                                onClick={this.launch} 
                                disabled={!currentStep.isFinished}
                            />
                        :
                            <FlatButton
                                label="Next"
                                className="btn-main"
                                id="next-step"
                                onClick={this.nextStep} 
                                disabled={!currentStep.isFinished}
                            />
                        }
                    </div>
                </div>
              </span>
          );
        return (
            <Modal
                title={currentStep.title}
                content={modalContent}
                shown={shown}
                className="campaigns-wizard"
            />
        );
    }
}

Wizard.propTypes = {
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    campaignId: PropTypes.string,
    campaignsStore: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired
}

export default Wizard;

