import React, { Component, PropTypes } from 'react';
import { observable, observe } from "mobx"
import { observer } from 'mobx-react';
import { WizardPackagesList } from './step2';
import { Loader } from '../../../partials';
import _ from 'underscore';

@observer
class WizardStep2 extends Component {
    constructor(props) {
        super(props);
        this.setWizardData = this.setWizardData.bind(this);
        this.togglePackage = this.togglePackage.bind(this);
        this.toggleStep = this.toggleStep.bind(this);
        this.disablePackageListItems = this.disablePackageListItems.bind(this);
        this.disableItemsOnEnter = this.disableItemsOnEnter.bind(this);
    }
    componentWillMount() {
        if(this.props.isLegacyShown) {
            this.props.packagesStore.fetchPackages();
        }
        this.props.packagesStore.fetchTufPackages();
    }
    componentDidMount() {
        this.disableItemsOnEnter(this.props.wizardData[1].packages);
    }
    componentWillUnmount() {
        this.props.setRawSelectedPacks(this.props.wizardData[1].packages);
    }
    togglePackage(chosenPackagesList, pack) {
        let found = _.find(chosenPackagesList, {packageName: pack.packageName});
        if(found) {
            let index = chosenPackagesList.indexOf(pack);
            chosenPackagesList.splice(index, 1);
        } else {
            chosenPackagesList.push(pack);
        }
    }
    toggleStep(chosenPackagesList, pack) {
        if(chosenPackagesList.length)
            this.props.markStepAsFinished();
        else
            this.props.markStepAsNotFinished();
    }
    disablePackageListItems(chosenPackagesList, pack) {
        let selector = null;
        switch(pack.inDirector) {
            case true:
                selector = '.campaigns-wizard-' + this.props.wizardIdentifier + ' .legacy';          
                break;
            default:
                selector = '.campaigns-wizard-' + this.props.wizardIdentifier + ' .item:not(.chosen)';
                break;
        }
        let items = document.querySelectorAll(selector);
        let found = _.find(chosenPackagesList, {packageName: pack.packageName});
        if(found) {
            _.each(items, (item, index) => {
                item.className += " disabled";
            });
        } else if(!chosenPackagesList.length) {
            _.each(items, (item, index) => {
                item.classList.remove("disabled");
            });
        }
    }
    setWizardData(pack) {
        let chosenPackagesList = this.props.wizardData[1].packages;
        this.togglePackage(chosenPackagesList, pack);
        this.toggleStep(chosenPackagesList, pack);
        this.disablePackageListItems(chosenPackagesList, pack);
    }
    disableItemsOnEnter(chosenPackagesList) {
        if(chosenPackagesList.length) {
            let firstEl = _.first(chosenPackagesList);
            this.disablePackageListItems(chosenPackagesList, firstEl);
        }
    }
    render() {
        const { wizardData, packagesStore, wizardIdentifier } = this.props;
        let chosenPackagesList = wizardData[1].packages;
        return (
            packagesStore.packagesFetchAsync.isFetching || packagesStore.packagesTufFetchAsync.isFetching ? 
                <div className="wrapper-center">
                    <Loader />
                </div>
            :
                <WizardPackagesList
                    chosenPackagesList={chosenPackagesList}
                    setWizardData={this.setWizardData}
                    wizardIdentifier={wizardIdentifier}
                    packagesStore={packagesStore}
                />
        );
    }
}

WizardStep2.propTypes = {
    wizardData: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired
}

export default WizardStep2;

