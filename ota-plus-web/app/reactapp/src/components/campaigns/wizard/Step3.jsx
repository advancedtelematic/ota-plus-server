import React, { Component, PropTypes } from 'react';
import { observable, observe } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { WizardPackagesVersionList } from './step3';
import { VelocityTransitionGroup } from 'velocity-react';
import { Loader } from '../../../partials';
import { SelectField, MenuItem } from 'material-ui';

const headerHeight = 28;

@observer
class WizardStep3 extends Component {
    @observable hardwareIdDuplicates = false;

    constructor(props) {
        super(props);
        this.sortByFirstLetter = this.sortByFirstLetter.bind(this);
        this.setHardwareIdDuplicates = this.setHardwareIdDuplicates.bind(this);
    }
    componentWillMount() {
        this.props.hardwareStore.fetchHardwareIds();
    }
    setHardwareIdDuplicates(value) {
        if(value)
            this.hardwareIdDuplicates = true;
        else
            this.hardwareIdDuplicates = false;
    }
    sortByFirstLetter(packagesList) {
        let sortedPackages = {};
        _.each(packagesList, (pack, index) => {
            let firstLetter = pack.packageName.charAt(0).toUpperCase();
            firstLetter = firstLetter.match(/[A-Z]/) ? firstLetter : '#';
            if(_.isUndefined(sortedPackages[firstLetter])) {
                sortedPackages[firstLetter] = [];
            }
            sortedPackages[firstLetter].push(pack);
        });
        return sortedPackages;
    }
    render() {
        const { wizardData, selectVersion, markStepAsFinished, markStepAsNotFinished, hardwareStore, rawSelectedPacks, removeSelectedPacksByKeys, packagesStore } = this.props;
        let chosenPackagesList = this.sortByFirstLetter(wizardData[1].packages);
        let selectedVersions = wizardData[2].versions;
        return (
            <div className="ios-list" ref="list">
                <span>
                    {hardwareStore.hardwareIdsFetchAsync.isFetching ?
                        <Loader />
                    :
                        <span>
                            {this.hardwareIdDuplicates ?
                                <div className="alert alert-danger" role="alert">
                                    You can't select the same hardware ids
                                </div>
                            :
                                null
                            }
                            {_.map(chosenPackagesList, (packages, letter) => {
                                let packsCount = wizardData[1].packages.length;
                                return (
                                    <span key={letter}>
                                        <div className="header">
                                            {letter}
                                        </div>
                                        {_.map(packages, (pack, index) => {
                                             return (
                                                <span key={index} className="key">
                                                    <WizardPackagesVersionList
                                                        pack={pack}
                                                        packsCount={packsCount}
                                                        selectedVersions={selectedVersions}
                                                        selectVersion={selectVersion}
                                                        markStepAsFinished={markStepAsFinished}
                                                        markStepAsNotFinished={markStepAsNotFinished}
                                                        hardwareStore={hardwareStore}
                                                        setHardwareIdDuplicates={this.setHardwareIdDuplicates}
                                                        hardwareIdDuplicates={this.hardwareIdDuplicates}
                                                        rawSelectedPacks={rawSelectedPacks}
                                                        removeSelectedPacksByKeys={removeSelectedPacksByKeys}
                                                        packagesStore={packagesStore}
                                                    />
                                                </span>
                                            );
                                        })}
                                    </span>
                                );
                            })}
                        </span>
                    }
                </span>
            </div>
        );
    }
}

WizardStep3.propTypes = {
    setWizardData: PropTypes.func.isRequired,
    packagesStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object
}

export default WizardStep3;