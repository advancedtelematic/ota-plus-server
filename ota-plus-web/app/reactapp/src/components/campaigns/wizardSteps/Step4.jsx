import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
import {WizardGroupsList} from './step4Files';
import {Loader, Form, FormInput} from '../../../partials';
import _ from 'underscore';

@observer
class WizardStep4 extends Component {
    constructor(props) {
        super(props);
        this.setWizardData = this.setWizardData.bind(this);
    }

    componentWillMount() {
        this.props.groupsStore.fetchWizardGroups();
    }

    setWizardData(groupId) {
        let stepWizardData = this.props.wizardData[3];
        const foundGroup = _.find(stepWizardData.groups, item => item.id === groupId);
        const groupToAdd = _.findWhere(this.props.groupsStore.wizardGroups, {id: groupId});

        if (foundGroup)
            stepWizardData.groups.splice(stepWizardData.groups.indexOf(foundGroup), 1);
        else
            stepWizardData.groups.push(groupToAdd);

        if (stepWizardData.groups.length)
            this.props.markStepAsFinished();
        else
            this.props.markStepAsNotFinished();
    }

    render() {
        const {wizardData, groupsStore} = this.props;
        const chosenGroups = wizardData[3].groups;
        return (
            groupsStore.groupsWizardFetchAsync.isFetching ?
                <div className="wrapper-center">
                    <Loader />
                </div>
                :
                <span>
                    <Form>
                        <FormInput
                            label="Select group(s)"
                            showIcon={false}
                            showInput={false}
                        />
                    </Form>
                    <WizardGroupsList
                        chosenGroups={chosenGroups}
                        setWizardData={this.setWizardData.bind(this)}
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

