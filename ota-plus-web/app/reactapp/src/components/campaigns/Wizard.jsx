import React, { Component, PropTypes } from 'react';
import { observable, observe, extendObservable } from "mobx"
import { observer } from 'mobx-react';
import { FlatButton } from 'material-ui';
import _ from 'underscore';
import { Form } from 'formsy-react';
import { AsyncStatusCallbackHandler } from '../../utils';
import { Modal, Loader, SearchBar } from '../../partials';
import Draggable from 'react-draggable';
import { 
    WizardStep1,
    WizardStep2,
    WizardStep3,
    WizardStep4,
    WizardStep5,
    WizardStep6,
} from './wizard';

const initialCurrentStepId = 0;
const initialWizardData = [
    {
        name: '',
    },
    {
        packages: [],
    },
    {
        versions: {},
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
        class: WizardStep6,
        name: "name",
        title: "Choose name",
        isFinished: false,
        isSearchBarShown: false,
    },
    {
        class: WizardStep1,
        name: "packages",
        title: "Select Package",
        isFinished: false,
        isSearchBarShown: false,
    },
    {
        class: WizardStep5,
        name: "versions",
        title: "Select software version",
        isFinished: false,
        isSearchBarShown: false,
    },
    {
        class: WizardStep2,
        title: "Select Group(s)",
        name: "groups",
        isFinished: false,
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
const minimizedWizardWidth = 400;
const minimizedWizardPadding = 25;

@observer
class Wizard extends Component {
    @observable currentStepId = initialCurrentStepId;
    @observable wizardSteps = initialWizardStep;
    @observable wizardData = initialWizardData;
    @observable filterValue = initialFilterValue;
    @observable campaignIdToAction = null;
    versions = {};

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
        this.launch = this.launch.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.handleMultiTargetUpdateCreated = this.handleMultiTargetUpdateCreated.bind(this);
        this.handleCampaignCreated = this.handleCampaignCreated.bind(this);
        this.selectVersion = this.selectVersion.bind(this);

        this.multiTargetUpdateCreatedHandler = observe(props.campaignsStore, (change) => {
            if(change.name === 'campaignsMultiTargetUpdateCreateAsync' && change.object[change.name].isFetching === false) {
                if(!_.includes(props.minimizedWizardIds, props.wizardIdentifier)) {
                    this.handleMultiTargetUpdateCreated();
                }
            }
        });
        this.campaignCreatedHandler = observe(props.campaignsStore, (change) => {
            if(change.name === 'campaignsCreateAsync' && change.object[change.name].isFetching === false) {
                if(!_.includes(props.minimizedWizardIds, props.wizardIdentifier)) {
                    this.handleCampaignCreated();
                }
            }
        });
    }
    componentWillUnmount() {
        this.multiTargetUpdateCreatedHandler();
        this.campaignCreatedHandler();
    }
    selectVersion(data) {
        if(_.isUndefined(this.versions[data.packageName])) {
            this.versions[data.packageName] = {};
        }
        switch(data.type) {
            case 'from':                
                this.versions[data.packageName] = {
                    from: data.version, 
                    to: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].to : null,
                    hardwareId: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].hardwareId : null
                }
                break;
            case 'to':
                this.versions[data.packageName] = {
                    to: data.version, 
                    from: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].from : null,
                    hardwareId: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].hardwareId : null
                }
                break;
            case 'hardwareId':
                this.versions[data.packageName] = {
                    to: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].to : null,
                    from: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].from : null,
                    hardwareId: data.hardwareId
                }
                break;
            default:
                break;
        }
        this.wizardData[2].versions = this.versions;
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
    launch() {
        if(this.campaignIdToAction) {
            // Add packages to campaign
            // Add versions to campaign
            // Add groups to campaign
            console.log('launching');
            this.props.campaignsStore.launchCampaign(this.campaignIdToAction);
        } else {
            let packages = this.wizardData[1].packages;
            let updates = this.wizardData[2].versions;
            let updateData = [];
            if(_.first(packages).inDirector) {
                _.each(updates, (update, packageName) => {
                    let fromFilepath = null;
                    let toFilepath = null;
                    let targetFormat = null;
                    let packages = this.props.packagesStore.packages;
                    _.each(packages, (pack, index) => {
                        if(pack.inDirector) {
                            if(pack.id.version === update.from) {
                                fromFilepath = pack.imageName;
                            }
                            if(pack.id.version === update.to) {                    
                                toFilepath = pack.imageName;
                            }
                            if(pack.id.name === packageName) {
                                targetFormat = pack.targetFormat;
                            }
                        }
                    });
                    updateData.push({
                        hardwareId: update.hardwareId,
                        from: {
                            target: fromFilepath,
                            hash: update.from
                        },
                        to: {
                            target: toFilepath,
                            hash: update.to
                        },
                        targetFormat: targetFormat,
                        generateDiff: false
                    });
                });
                this.props.campaignsStore.createMultiTargetUpdate(updateData);
            }
        }
    }
    handleMultiTargetUpdateCreated() {
        let createData = {
            name: this.wizardData[0].name,
            update: this.props.campaignsStore.campaignData.mtuId,
            groups: this.wizardData[3].groups
        };
        this.props.campaignsStore.createCampaign(createData);
    }
    handleCampaignCreated() {        
        this.props.campaignsStore.launchCampaign(this.props.campaignsStore.campaignData.campaignId);
        this.props.hideWizard(this.props.wizardIdentifier);
    }
    changeFilter(filterValue) {
        this.filterValue = filterValue;
    }
    render() {
        const { campaignsStore, packagesStore, groupsStore, hardwareStore, campaignId, wizardIdentifier, hideWizard, toggleWizard, minimizedWizardIds } = this.props;
        const currentStep = this.wizardSteps[this.currentStepId];
        this.campaignIdToAction = campaignId;        
        const modalContent = (
            !_.includes(minimizedWizardIds, wizardIdentifier) ?
                <span>
                    <div className="heading">
                        {this.wizardSteps[this.currentStepId].title}
                        <a href="#" className="box-toggle" title="Toggle upload box size" onClick={toggleWizard.bind(this, wizardIdentifier)}>
                            <i className={"fa toggle-modal-size " + (_.includes(minimizedWizardIds, wizardIdentifier) ? "fa-angle-up" : "fa-angle-down")} aria-hidden="true"></i>
                        </a>
                    </div>
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
                                        groupsStore: groupsStore,
                                        hardwareStore: hardwareStore,
                                        selectFromVersion: this.selectFromVersion,
                                        selectedFromVersion: this.selectedFromVersion,
                                        selectVersion: this.selectVersion,
                                        wizardIdentifier: wizardIdentifier,
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
                                      <a href="#" className="link-close" id="save-and-close" onClick={hideWizard.bind(this, wizardIdentifier)}>
                                          Close
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
                    
                </span>
            :
                null            
        );
        return (            
            <Draggable
                bounds="html"
                disabled={true}
            >
                <div className={"campaigns-wizard campaigns-wizard-" + wizardIdentifier}>
                    <div className="draggable-content">
                        <div className="body">
                            {modalContent}
                        </div>
                    </div>
                </div>
            </Draggable>            
        );
    }
}

Wizard.propTypes = {
    campaignId: PropTypes.string,
    campaignsStore: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object
}

export default Wizard;

