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
        class: WizardStep1,
        name: "name",
        title: "Choose name",
        isFinished: false,
        isSearchBarShown: false,
    },
    {
        class: WizardStep2,
        name: "packages",
        title: "Select Package",
        isFinished: false,
        isSearchBarShown: false,
    },
    {
        class: WizardStep3,
        name: "versions",
        title: "Select software version",
        isFinished: false,
        isSearchBarShown: false,
    },
    {
        class: WizardStep4,
        title: "Select Group(s)",
        name: "groups",
        isFinished: false,
        isSearchBarShown: false,
    },
    {
        class: WizardStep5,
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
    @observable rawSelectedPacks = [];
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
        this.handleLegacyCampaignCreated = this.handleLegacyCampaignCreated.bind(this);
        this.handleLegacyCampaignPackageSaved = this.handleLegacyCampaignPackageSaved.bind(this);
        this.handleLegacyCampaignGroupsSaved = this.handleLegacyCampaignGroupsSaved.bind(this);
        this.selectVersion = this.selectVersion.bind(this);
        this.setRawSelectedPacks = this.setRawSelectedPacks.bind(this);
        this.removeSelectedPacksByKeys = this.removeSelectedPacksByKeys.bind(this);
        this.handleLegacyCampaignLaunched = this.handleLegacyCampaignLaunched.bind(this);

        this.multiTargetUpdateCreatedHandler = observe(props.campaignsStore, (change) => {
            if(change.name === 'campaignsMultiTargetUpdateCreateAsync' && change.object[change.name].isFetching === false) {
                let wizardMinimized = _.find(props.minimizedWizards, (wizard, index) => {
                    return wizard.id === props.wizardIdentifier;
                });
                if(!wizardMinimized) {
                    this.handleMultiTargetUpdateCreated();
                }
            }
        });
        this.campaignCreatedHandler = observe(props.campaignsStore, (change) => {
            if(change.name === 'campaignsCreateAsync' && change.object[change.name].isFetching === false) {
                 let wizardMinimized = _.find(props.minimizedWizards, (wizard, index) => {
                    return wizard.id === props.wizardIdentifier;
                });
                if(!wizardMinimized) {
                    if(change.object[change.name].status !== 'error') {
                        this.handleCampaignCreated();
                    }
                }
            }
        });
        this.legacyCampaignCreatedHandler = observe(props.campaignsStore, (change) => {
            if(change.name === 'campaignsLegacyCreateAsync' && change.object[change.name].isFetching === false) {
                 let wizardMinimized = _.find(props.minimizedWizards, (wizard, index) => {
                    return wizard.id === props.wizardIdentifier;
                });
                if(!wizardMinimized) {
                    if(change.object[change.name].status !== 'error') {
                        this.handleLegacyCampaignCreated();
                    }
                }
            }
        });
        this.legacyCampaignSavePackageHandler = observe(props.campaignsStore, (change) => {
            if(change.name === 'campaignsPackageSaveAsync' && change.object[change.name].isFetching === false) {
                 let wizardMinimized = _.find(props.minimizedWizards, (wizard, index) => {
                    return wizard.id === props.wizardIdentifier;
                });
                if(!wizardMinimized) {
                    this.handleLegacyCampaignPackageSaved();
                }
            }
        });
        this.legacyCampaignSaveGroupsHandler = observe(props.campaignsStore, (change) => {
            if(change.name === 'campaignsGroupsSaveAsync' && change.object[change.name].isFetching === false) {
                 let wizardMinimized = _.find(props.minimizedWizards, (wizard, index) => {
                    return wizard.id === props.wizardIdentifier;
                });
                if(!wizardMinimized) {
                    this.handleLegacyCampaignGroupsSaved();
                }
            }
        });
        this.legacyCampaignLaunchHandler = observe(props.campaignsStore, (change) => {
            if(change.name === 'campaignsLegacyLaunchAsync' && change.object[change.name].isFetching === false) {
                 let wizardMinimized = _.find(props.minimizedWizards, (wizard, index) => {
                    return wizard.id === props.wizardIdentifier;
                });
                if(!wizardMinimized) {
                    this.handleLegacyCampaignLaunched();
                }
            }
        });
    }
    componentWillUnmount() {
        this.multiTargetUpdateCreatedHandler();
        this.campaignCreatedHandler();
        this.legacyCampaignCreatedHandler();
        this.legacyCampaignSavePackageHandler();
        this.legacyCampaignSaveGroupsHandler();
        this.legacyCampaignLaunchHandler();
    }
    setRawSelectedPacks(packs) {
        this.rawSelectedPacks = [];
        this.rawSelectedPacks = packs;
    }
    removeSelectedPacksByKeys(keys) {
        _.each(keys, (key, i) => {
            delete this.wizardData[2].versions[key];
            delete this.versions[key];
        });
    }
    selectVersion(data) {
        if(_.isUndefined(this.versions[data.packageName])) {
            this.versions[data.packageName] = {};
        }
        let hash = data.imageName;
        _.each(this.props.packagesStore.packages, (pack, index) => {
            if(pack.imageName === data.imageName) {
                hash = pack.packageHash;
            }
        });

        let changedPackage = null;
        _.each(this.props.packagesStore.preparedPackages, (packs, letter) => {
            _.each(packs, (pack, index) => {
                _.each(pack.versions, (version, i) => {
                    if(version.id.name === data.imageName) {
                        changedPackage = pack;
                        this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].from = null : null;
                        this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].fromFilepath = null : null;
                    }
                })
            });
        });

        switch(data.type) {
            case 'from':                
                this.versions[data.packageName] = {
                    from: hash, 
                    fromFilepath: data.imageName,
                    to: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].to : null,
                    toFilepath: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].toFilepath : null,
                    toPackageName: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].toPackageName : null,
                    hardwareId: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].hardwareId : null,
                    changedPackage: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].changedPackage : {},
                    disableValidation: false
                }
                break;
            case 'to':
                this.versions[data.packageName] = {
                    to: hash, 
                    toFilepath: data.imageName,
                    from: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].from : null,
                    toPackageName: data.packageName,
                    fromFilepath: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].fromFilepath : null,
                    hardwareId: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].hardwareId : null,
                    changedPackage: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].changedPackage : {},
                    disableValidation: false
                }
                break;
            case 'hardwareId':
                this.versions[data.packageName] = {
                    to: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].to : null,
                    toFilepath: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].toFilepath : null,
                    from: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].from : null,
                    fromFilepath: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].fromFilepath : null,
                    toPackageName: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].toPackageName : null,
                    hardwareId: data.hardwareId,
                    changedPackage: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].changedPackage : {},
                    disableValidation: false
                }
                break;
            case 'package':
                this.versions[data.packageName] = {
                    to: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].to : null,
                    toFilepath: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].toFilepath : null,
                    toPackageName: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].toPackageName : null,
                    from: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].from : null,
                    fromFilepath: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].fromFilepath : null,
                    hardwareId: this.wizardData[2].versions[data.packageName] ? this.wizardData[2].versions[data.packageName].hardwareId : null,
                    changedPackage: changedPackage,
                    disableValidation: true
                }
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
        let packages = this.wizardData[1].packages;
        let updates = this.wizardData[2].versions;
        let updateData = [];

        if(_.first(packages).inDirector) {
            _.each(updates, (update, packageName) => {
                let fromHash = null;
                let toHash = null;
                let targetFormat = null;
                let fromTargetLength = null;
                let toTargetLength = null;
                let packages = this.props.packagesStore.packages;
                _.each(packages, (pack, index) => {
                    if(pack.inDirector) {
                        if(pack.imageName === update.fromFilepath) {
                            fromTargetLength = pack.targetLength;
                            fromHash = pack.packageHash;
                        }
                        if(pack.imageName === update.toFilepath) {                    
                            toTargetLength = pack.targetLength;
                            toHash = pack.packageHash;
                        }
                        if(pack.id.name === packageName) {
                            targetFormat = pack.targetFormat;
                        }
                    }
                });
                updateData.push({
                    hardwareId: update.hardwareId,
                    from: {
                        target: update.fromFilepath,
                        targetLength: fromTargetLength,
                        hash: fromHash
                    },
                    to: {
                        target: update.toFilepath,
                        targetLength: toTargetLength,
                        hash: toHash
                    },
                    targetFormat: targetFormat,
                    generateDiff: false
                });
            });
            this.props.campaignsStore.createMultiTargetUpdate(updateData);
        } else {
            let pack = _.first(packages);
            let data = {
                name: this.wizardData[0].name
            };
            this.props.campaignsStore.createLegacyCampaign(data);
        }
    }
    handleMultiTargetUpdateCreated() {
        let createData = {
            name: this.wizardData[0].name,
            update: this.props.campaignsStore.campaignData.mtuId,
            groups: _.map(this.wizardData[3].groups, (group, index) => { return group.id })
        };
        this.props.campaignsStore.createCampaign(createData);
    }
    handleCampaignCreated() {
        this.props.campaignsStore.launchCampaign(this.props.campaignsStore.campaignData.campaignId);
        this.props.hideWizard(this.props.wizardIdentifier);
        this.props.campaignsStore.fetchCampaigns('campaignsSafeFetchAsync');
    }
    handleLegacyCampaignCreated() {
        let pack = _.first(this.wizardData[1].packages);
        let version = this.wizardData[2].versions[pack.packageName].to;
        let packageData = {
            name: pack.packageName,
            version: version
        };
        this.props.campaignsStore.savePackageForCampaign(this.props.campaignsStore.campaignData.campaignId, packageData);
    }
    handleLegacyCampaignPackageSaved() {
        let groupsData = this.wizardData[3];
        let groupIds = _.map(groupsData.groups, (group, index) => {
            return group.id;
        });
        this.props.campaignsStore.saveGroupsForCampaign(this.props.campaignsStore.campaignData.campaignId, {groups: groupIds });
    }
    handleLegacyCampaignGroupsSaved() {
        this.props.campaignsStore.launchLegacyCampaign(this.props.campaignsStore.campaignData.campaignId);
    }
    handleLegacyCampaignLaunched() {
        this.props.hideWizard(this.props.wizardIdentifier);
        this.props.campaignsStore.fetchLegacyCampaigns('campaignsLegacySafeFetchAsync');
    }
    changeFilter(filterValue) {
        this.filterValue = filterValue;
    }
    render() {
        const { campaignsStore, packagesStore, groupsStore, hardwareStore, wizardIdentifier, hideWizard, toggleWizard, minimizedWizards } = this.props;
        const currentStep = this.wizardSteps[this.currentStepId];

        let wizardMinimized = _.find(minimizedWizards, (wizard, index) => {
            return wizard.id === wizardIdentifier;
        });

        const modalContent = (
            <div className={"campaigns-wizard campaigns-wizard-" + wizardIdentifier}>
                <div className="draggable-content">
                    <div className="body">
                        <span>
                            <div className="heading">
                                {this.wizardSteps[this.currentStepId].title}
                                <div className="wizard-actions">
                                    <a href="#" id="close-wizard" className="box-toggle pack-box-close" title="Close wizard" onClick={hideWizard.bind(this, wizardIdentifier)}>
                                        <img src="/assets/img/icons/white/cross.svg" alt="Icon" />
                                    </a>
                                    <a href="#" id="minimize-wizard" className="box-toggle pack-box-minimize" title="Minimize wizard" onClick={toggleWizard.bind(this, wizardIdentifier, this.wizardData[0].name)}>
                                        <img src="/assets/img/icons/white/minimize.svg" alt="Icon" />
                                    </a>
                                </div>
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
                                                campaignsStore: campaignsStore,
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
                                                setRawSelectedPacks: this.setRawSelectedPacks,
                                                rawSelectedPacks: this.rawSelectedPacks,
                                                removeSelectedPacksByKeys: this.removeSelectedPacksByKeys,
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
                    </div>
                </div>
            </div>
        );
        return (
            <Modal 
                title="Add new campaign"
                content={modalContent}
                shown={!wizardMinimized}
                onRequestClose={toggleWizard.bind(this, wizardIdentifier, this.wizardData[0].name)}
            />
        );
    }
}

Wizard.propTypes = {
    campaignsStore: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object
}

export default Wizard;

