import React, { Component, PropTypes } from 'react';
import { observable, observe } from "mobx"
import { observer } from 'mobx-react';
import { WizardPackagesList } from './step2';
import { Loader, Form, FormInput } from '../../../partials';
import _ from 'underscore';

@observer
class WizardStep2 extends Component {
    constructor(props) {
        super(props);
        this.setWizardData = this.setWizardData.bind(this);
        this.togglePackage = this.togglePackage.bind(this);
        this.toggleStep = this.toggleStep.bind(this);
    }
    componentWillMount() {
        this.props.packagesStore.fetchPackages('packagesSafeFetchAsync');
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
    setWizardData(pack) {
        let chosenPackagesList = this.props.wizardData[1].packages;
        this.togglePackage(chosenPackagesList, pack);
        this.toggleStep(chosenPackagesList, pack);
    }
    render() {
        const { wizardData, packagesStore, wizardIdentifier } = this.props;
        let chosenPackagesList = wizardData[1].packages;
        return (
            packagesStore.packagesSafeFetchAsync.isFetching ? 
                <div className="wrapper-center">
                    <Loader />
                </div>
            :
                <div>
                    <Form>
                        <FormInput
                            label="Select package"
                            showIcon={true}
                            showInput={false}
                        />
                    </Form>
                    <WizardPackagesList
                        chosenPackagesList={chosenPackagesList}
                        setWizardData={this.setWizardData}
                        wizardIdentifier={wizardIdentifier}
                        packagesStore={packagesStore}
                    />
                </div>
        );
    }
}

WizardStep2.propTypes = {
    wizardData: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired
}

export default WizardStep2;

