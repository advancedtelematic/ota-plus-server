import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { WizardGroupsList } from './step2';
import { Loader } from '../../../partials';

@observer
class WizardStep2 extends Component {
    constructor(props) {
        super(props);
        this.setWizardData = this.setWizardData.bind(this);
    }
    componentWillMount() {
        this.props.groupsStore.fetchGroups();
    }
    setWizardData(groupId) {
        let stepWizardData = this.props.wizardData[3];
        if(stepWizardData.groups.indexOf(groupId) > -1) {
            stepWizardData.groups.splice(stepWizardData.groups.indexOf(groupId), 1);
        } else {
            stepWizardData.groups.push(groupId);
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
            !groupsStore.overallGroupsCount && groupsStore.groupsFetchAsync.isFetching ? 
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

WizardStep2.propTypes = {
    wizardData: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired
}

export default WizardStep2;

