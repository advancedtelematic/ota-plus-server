import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { WizardGroupsList } from './step2Files';
import { Loader, Form, FormInput } from '../../../partials';
import _ from 'underscore';

@inject("stores")
@observer
class WizardStep2 extends Component {
    constructor(props) {
        super(props);
        this.setWizardData = this.setWizardData.bind(this);
    }

    componentWillMount() {
        const { groupsStore } = this.props.stores;
        groupsStore.fetchWizardGroups();
    }

    setWizardData(groupId) {
        const { groupsStore } = this.props.stores;
        const { groups } = this.props.wizardData;

        const foundGroup = _.find(groups, item => item.id === groupId);
        const groupToAdd = _.findWhere(groupsStore.wizardGroups, { id: groupId });

        if (foundGroup) {
            groups.splice(groups.indexOf(foundGroup), 1);
        } else {
            groups.push(groupToAdd);
        }

        if (groups.length) {
            this.props.markStepAsFinished();
        } else {
            this.props.markStepAsNotFinished();
        }
    }

    render() {
        const { groups: chosenGroups} = this.props.wizardData;
        const { groupsStore } = this.props.stores;

        return (
            groupsStore.groupsWizardFetchAsync.isFetching ?
                <div className="wrapper-center">
                    <Loader/>
                </div>
                :
                <span>
                    <Form>
                        <FormInput
                            label="Select group(s)"
                            showIcon={ false }
                            showInput={ false }
                        />
                    </Form>
                    <WizardGroupsList
                        chosenGroups={ chosenGroups }
                        setWizardData={ this.setWizardData.bind(this) }
                    />
                </span>
        );
    }
}

WizardStep2.propTypes = {
    wizardData: PropTypes.object.isRequired,
    stores: PropTypes.object,
};

export default WizardStep2;

