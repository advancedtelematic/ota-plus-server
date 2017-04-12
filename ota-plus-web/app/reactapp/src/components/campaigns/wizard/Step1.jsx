import React, { Component, PropTypes } from 'react';
import { observe } from "mobx"
import { observer } from 'mobx-react';
import { WizardPackagesList } from './step1';
import { Loader } from '../../../partials';

@observer
class WizardStep1 extends Component {
    constructor(props) {
        super(props);
        this.setWizardData = this.setWizardData.bind(this);
    }
    componentWillMount() {
        this.props.packagesStore.fetchPackages();
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.filterValue !== this.props.filterValue)
            this.props.packagesStore.fetchPackages(nextProps.filterValue);
    }
    setWizardData(packageName, packageVersion) {
        let stepWizardData = this.props.wizardData[0];
        stepWizardData.package = {
            name: packageName,
            version: packageVersion
        };
        this.props.markStepAsFinished();
    }
    render() {
        const { wizardData, packagesStore } = this.props;
        const chosenPackage = wizardData[0].package;
        return (
            !packagesStore.overallPackagesCount && packagesStore.packagesFetchAsync.isFetching ? 
                <div className="wrapper-center">
                    <Loader />
                </div>
            :
                <WizardPackagesList 
                    chosenPackage={chosenPackage}
                    setWizardData={this.setWizardData}
                    packagesStore={packagesStore}
                />
        );
    }
}

WizardStep1.propTypes = {
    wizardData: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired
}

export default WizardStep1;

