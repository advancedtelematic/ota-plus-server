import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { WizardGroupsList } from './step4';
import { Loader } from '../../../partials';
import _ from 'underscore';

@observer
class WizardStep4 extends Component {
    constructor(props) {
        super(props);
        this.setWizardData = this.setWizardData.bind(this);
    }
    componentWillMount() {
        this.props.groupsStore.fetchGroups();
    }
    setWizardData(groupId) {
        let group = _.findWhere(this.props.groupsStore.groups, {id: groupId});

        let stepWizardData = this.props.wizardData[3];
        if(stepWizardData.groups.indexOf(group) > -1) {
            stepWizardData.groups.splice(stepWizardData.groups.indexOf(group), 1);
        } else {
            stepWizardData.groups.push(group);
        }
        if(stepWizardData.groups.length)
            this.props.markStepAsFinished();
        else
            this.props.markStepAsNotFinished();
    }
    render() {
        const { wizardData, groupsStore } = this.props;
        const chosenGroups = wizardData[3].groups;
        return (
            groupsStore.groupsFetchAsync.isFetching ?
                <div className="wrapper-center">
                    <Loader />
                </div>
            :
                <span>
                    <WizardGroupsList
                        chosenGroups={chosenGroups}
                        setWizardData={this.setWizardData}
                        groupsStore={groupsStore}
                    />

                </span>
        );
    }
}

WizardStep4.propTypes = {
    wizardData: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired
}

export default WizardStep4;

