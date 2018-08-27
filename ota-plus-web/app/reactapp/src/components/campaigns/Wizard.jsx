import React, {Component, PropTypes} from 'react';
import {observable, observe, extendObservable} from "mobx"
import {observer, inject} from 'mobx-react';
import {FlatButton} from 'material-ui';
import _ from 'underscore';
import {Form} from 'formsy-react';
import {AsyncStatusCallbackHandler} from '../../utils';
import {Modal, Loader, SearchBar} from '../../partials';
import { UpdateDetails } from './wizardSteps/step2Files';
import Draggable from 'react-draggable';
import {
    WizardStep1,
    WizardStep2,
    WizardStep3,
    WizardStep4,
    WizardStep5,
    WizardStep6,
    WizardStep7,
} from './wizardSteps';

const initialCurrentStepId = 0;
const initialWizardData = [
    {
        name: '',
    },
    {
        update: [],
    },
    {
        groups: [],
    },
    {
        isActivated: false,
    },
];
const initialWizardStepForAlphaPlus = [
    {
        class: WizardStep1,
        name: "name",
        title: "Select name",
        isFinished: false,
        isSearchBarShown: false,
    },
    {
        class: WizardStep2,
        name: "updates",
        title: "Select Update",
        isFinished: false,
        isSearchBarShown: false,
    },
    {
        class: WizardStep3,
        title: "Select Group(s)",
        name: "groups",
        isFinished: false,
        isSearchBarShown: false,
    },
    {
        class: WizardStep4,
        title: "Distribution information",
        name: "metadata",
        isFinished: false,
        isSearchBarShown: false,
    },
    {
        class: WizardStep5,
        title: "Dependencies management",
        name: "dependencies-management",
        isFinished: false,
        isSearchBarShown: false,
    },
    {
        class: WizardStep6,
        title: "Programming sequencer",
        name: "programming-sequencer",
        isFinished: true,
        isSearchBarShown: false,
    },
    {
        class: WizardStep7,
        title: "Summary",
        name: "summary",
        finishButtonLabel: "Launch",
        isFinished: true,
        isSearchBarShown: false,
    },
];

const initialWizardStep = [
    {
        class: WizardStep1,
        name: "name",
        title: "Select name",
        isFinished: false,
        isSearchBarShown: false,
    },
    {
        class: WizardStep2,
        name: "updates",
        title: "Select Update",
        isFinished: false,
        isSearchBarShown: false,
    },
    {
        class: WizardStep3,
        title: "Select Group(s)",
        name: "groups",
        isFinished: false,
        isSearchBarShown: false,
    },
    {
        class: WizardStep4,
        title: "Distribution information",
        name: "metadata",
        isFinished: false,
        isSearchBarShown: false,
    },
    {
        class: WizardStep7,
        title: "Summary",
        name: "summary",
        finishButtonLabel: "Launch",
        isFinished: true,
        isSearchBarShown: false,
    },
];

const initialFilterValue = null;
const minimizedWizardWidth = 400;
const minimizedWizardPadding = 25;

@inject("stores")
@observer
class Wizard extends Component {
    @observable currentStepId = initialCurrentStepId;
    @observable wizardSteps = (this.props.stores.featuresStore.alphaPlusEnabled ? initialWizardStepForAlphaPlus : initialWizardStep);
    @observable wizardData = initialWizardData;
    @observable filterValue = initialFilterValue;
    @observable currentDetails = null;
    @observable rawSelectedPacks = [];
    @observable approvalNeeded = false;
    versions = {};

    constructor(props) {
        super(props);
        const { campaignsStore } = props.stores;
        this.addToCampaign = this.addToCampaign.bind(this);
        this.isFirstStep = this.isFirstStep.bind(this);
        this.isLastStep = this.isLastStep.bind(this);
        this.prevStep = this.prevStep.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.jumpToStep = this.jumpToStep.bind(this);
        this.verifyIfPreviousStepsFinished = this.verifyIfPreviousStepsFinished.bind(this);
        this.markStepAsFinished = this.markStepAsFinished.bind(this);
        this.markStepAsNotFinished = this.markStepAsNotFinished.bind(this);
        this.setWizardData = this.setWizardData.bind(this);
        this.setApprove = this.setApprove.bind(this);
        this.launch = this.launch.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.handleMultiTargetUpdateCreated = this.handleMultiTargetUpdateCreated.bind(this);
        this.handleCampaignCreated = this.handleCampaignCreated.bind(this);

        this.toggleFullScreen = this.toggleFullScreen.bind(this);
        this.showUpdateDetails = this.showUpdateDetails.bind(this);
        this.hideUpdateDetails = this.hideUpdateDetails.bind(this);

        this.multiTargetUpdateCreatedHandler = observe(campaignsStore, (change) => {
            if (change.name === 'campaignsMtuCreateAsync' && change.object[change.name].isFetching === false) {
                let wizardMinimized = _.find(props.minimizedWizards, (wizard, index) => {
                    return wizard.id === props.wizardIdentifier;
                });
                if (!wizardMinimized) {
                    this.handleMultiTargetUpdateCreated();
                }
            }
        });
        this.campaignCreatedHandler = observe(campaignsStore, (change) => {
            if (change.name === 'campaignsCreateAsync' && change.object[change.name].isFetching === false) {
                let wizardMinimized = _.find(props.minimizedWizards, (wizard, index) => {
                    return wizard.id === props.wizardIdentifier;
                });
                if (!wizardMinimized) {
                    if (change.object[change.name].status !== 'error') {
                        this.handleCampaignCreated();
                    }
                }
            }
        });
    }

    componentWillMount() {
        const { skipStep } = this.props;
        const { groupsStore, updateStore } = this.props.stores;

        if(skipStep) {
            this.wizardSteps = _.filter(this.wizardSteps, step => step.name !== skipStep);
            const selectedGroup = groupsStore.selectedGroup;
            groupsStore.fetchDevicesForSelectedGroup(selectedGroup.id).then(() => {
                this.wizardData[3].groups = this.wizardData[3].groups.concat(selectedGroup);
            });
        }
        
        let matrixFromStorage = JSON.parse(localStorage.getItem(`matrix-${this.props.wizardIdentifier}`));
        if (matrixFromStorage) {
            localStorage.removeItem(`matrix-${this.props.wizardIdentifier}`);
        }
        updateStore.fetchUpdates();
    }

    componentWillUnmount() {
        this.multiTargetUpdateCreatedHandler();
        this.campaignCreatedHandler();
    }

    toggleFullScreen(e) {
        const { campaignsStore } = this.props.stores;
        if(e) e.preventDefault();
        if(!campaignsStore.fullScreenMode) 
            campaignsStore._showFullScreen();
        else
            campaignsStore._hideFullScreen();
    }

    addToCampaign(packName, e) {
        if (e) e.preventDefault();
        const { updateStore } = this.props.stores;
        this.currentStepId = 2;
        let sortedUpdates = updateStore.preparedUpdates;
        _.each(sortedUpdates, (packs, letter) => {
            let pack = _.find(packs, pack => pack.packageName === packName);
            if (pack) {
                if (this.wizardData[1].update.indexOf(pack) === -1) {
                    this.wizardData[1].update.push(pack);
                }
            }
        });
    }

    isFirstStep() {
        return this.currentStepId === 0;
    }

    isLastStep() {
        return this.currentStepId === this.wizardSteps.length - 1;
    }

    prevStep() {
        if (this.currentStepId !== 0) {
            this.currentStepId = this.currentStepId - 1;
            this.filterValue = initialFilterValue;
        }
    }

    nextStep() {
        if (this.verifyIfPreviousStepsFinished(this.currentStepId) && this.currentStepId !== this.wizardSteps.length - 1) {
            this.currentStepId = this.currentStepId + 1;
            this.filterValue = initialFilterValue;
        }
    }

    jumpToStep(stepId, e) {
        e.preventDefault();
        if (stepId < this.currentStepId || this.verifyIfPreviousStepsFinished(stepId - 1)) {
            this.currentStepId = stepId;
            this.filterValue = initialFilterValue;
        }
    }

    verifyIfPreviousStepsFinished(stepId) {
        if (_.find(this.wizardSteps, function (step, index) {
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

    setApprove(boolean) {
        this.approvalNeeded = boolean;
    }

    launch() {
        const { campaignsStore } = this.props.stores;
        campaignsStore.createMultiTargetUpdate(this.wizardData[1].update);
    }

    handleMultiTargetUpdateCreated() {
        const { campaignsStore } = this.props.stores;
        let updateId = campaignsStore.campaignData.mtuId;

        let matrixFromStorage = JSON.parse(localStorage.getItem(`matrix-${this.props.wizardIdentifier}`));
        localStorage.removeItem(`matrix-${this.props.wizardIdentifier}`);
        localStorage.setItem(`matrix-${updateId}`, JSON.stringify(matrixFromStorage));

        let createData = {
            name: this.wizardData[0].name,
            update: updateId,
            groups: _.map(this.wizardData[3].groups, (group, index) => {
                return group.id
            }),
            metadata: _.without(_.map(this.wizardData[4], (val, key) => {
                return {
                    type: key,
                    value: val
                }
            }), undefined),
            approvalNeeded: this.approvalNeeded
        };

        if (!this.wizardData[4].isActivated) {
            createData = _.omit(createData, 'metadata')
        }

        campaignsStore.createCampaign(createData);
    }

    handleCampaignCreated() {
        const { campaignsStore } = this.props.stores;
        campaignsStore.launchCampaign(campaignsStore.campaignData.campaignId);
        this.props.hideWizard(this.props.wizardIdentifier);
        campaignsStore.fetchCampaigns('campaignsSafeFetchAsync');
    }

    changeFilter(filterValue) {
        this.filterValue = filterValue;
    }

    showUpdateDetails(update, e) {
        this.currentDetails = update;
    }

    hideUpdateDetails() {
        this.currentDetails = null;
    }

    render() {
        const { wizardIdentifier, hideWizard, toggleWizard, minimizedWizards} = this.props;
        const { campaignsStore, featuresStore } = this.props.stores;
        const currentStep = this.wizardSteps[this.currentStepId];

        let wizardMinimized = _.find(minimizedWizards, (wizard, index) => {
            return wizard.id === wizardIdentifier;
        });

        const modalContent = (
            this.currentDetails ?
                <UpdateDetails details={ this.currentDetails } isEditable={ false }/>
            :
            <div
                className={"campaigns-wizard campaigns-wizard-" + wizardIdentifier + (campaignsStore.fullScreenMode ? ' full-screen' : '')}>
                <div className="draggable-content">                    
                    <div className="internal-body">
                        <div className="stepper">
                            <div className="wrapper-steps-no">
                                {_.map(this.wizardSteps, (step, index) => {
                                    return (
                                        <div
                                            className={"step" + (this.currentStepId == index ? " active" : "")}
                                            key={'wizard-step-' + index}>
                                            <a href="#" className="dot"
                                               onClick={this.jumpToStep.bind(this, index)}>
                                                {index + 1}
                                            </a>
                                            <div className="stepnum">
                                                {step.title}
                                            </div>
                                        </div>
                                    );
                                }, this)}
                            </div>
                        </div>
                            <div className={"content-step step-" + currentStep.name}>
                                {campaignsStore.campaignsOneFetchAsync.isFetching ?
                                    <div className="wrapper-center">
                                        <Loader />
                                    </div>
                                    :
                                    React.createElement(currentStep.class, {
                                        campaign: {},
                                        setWizardData: this.setWizardData,
                                        setApprove: this.setApprove,
                                        currentStepId: this.currentStepId,
                                        wizardData: this.wizardData,
                                        markStepAsFinished: this.markStepAsFinished,
                                        markStepAsNotFinished: this.markStepAsNotFinished,
                                        filterValue: this.filterValue,
                                        selectFromVersion: this.selectFromVersion,
                                        selectedFromVersion: this.selectedFromVersion,
                                        selectVersion: this.selectVersion,
                                        wizardIdentifier: wizardIdentifier,
                                        setRawSelectedPacks: this.setRawSelectedPacks,
                                        rawSelectedPacks: this.rawSelectedPacks,
                                        removeSelectedPacksByKeys: this.removeSelectedPacksByKeys,
                                        addToCampaign: this.addToCampaign,
                                        approvalNeeded: this.approvalNeeded,
                                        alphaPlus: featuresStore.alphaPlusEnabled,
                                        showUpdateDetails: this.showUpdateDetails,
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
                            <div className="wizard-actions">
                                <div className="wrapper-confirm">
                                {this.isLastStep() ?
                                    <button
                                        className="btn-primary btn-red"
                                        id="wizard-launch-button"
                                        onClick={this.launch}
                                        disabled={!currentStep.isFinished}
                                    >Launch</button>
                                    :
                                    <button
                                        className="btn-primary"
                                        id="next-step"
                                        onClick={this.nextStep}
                                        disabled={!currentStep.isFinished}
                                    >Next</button>
                                }
                                </div>
                            </div>
                    </div>
                </div>
                <div id="dropdown-render"></div>
            </div>
        );
        return (
            <Modal
                title={ !this.currentDetails ? "Add new campaign" : "Campaign update details" }
                topActions={
                    this.currentDetails ?
                        <div className="top-actions flex-end">
                            <div className="wizard-close" onClick={ this.hideUpdateDetails } id="close-details">
                                <img src="/assets/img/icons/close.svg" alt="Icon" />
                            </div>
                        </div>
                        :
                        <div className="top-actions">
                            <div className="wizard-minimize" onClick={toggleWizard.bind(this, wizardIdentifier, this.wizardData[0].name)} id="minimize-wizard">
                                <img src="/assets/img/icons/minimize.svg" alt="Icon" />
                            </div>
                            <div className={"toggle-fullscreen" + (campaignsStore.fullScreenMode ? " on" : " off")} onClick={this.toggleFullScreen}>
                                {campaignsStore.fullScreenMode ?
                                    <img src="/assets/img/icons/exit-fullscreen.svg" alt="Icon" id="exit-fullscreen-wizard" />
                                :
                                    <img src="/assets/img/icons/maximize.svg" alt="Icon" id="enter-fullscreen-wizard" />
                                }
                            </div>
                            <div className="wizard-close" onClick={hideWizard.bind(this, wizardIdentifier)} id="close-wizard">
                                <img src="/assets/img/icons/close.svg" alt="Icon" />
                            </div>
                        </div>
                }
                content={modalContent}
                shown={!wizardMinimized}
                onRequestClose={toggleWizard.bind(this, wizardIdentifier, this.wizardData[0].name)}
                className={"dialog-campaign-wizard " + (campaignsStore.fullScreenMode ? "full-screen" : "") + (campaignsStore.transitionsEnabled ? "" : " disable-transitions")}
            />
        );
    }
}

Wizard.propTypes = {
    stores: PropTypes.object,
};

export default Wizard;

