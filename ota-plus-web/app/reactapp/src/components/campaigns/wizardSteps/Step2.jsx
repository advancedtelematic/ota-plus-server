import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { Tabs, Tab } from 'material-ui/Tabs';
import { WizardGroupsList, WizardOLPGroupsListItem } from './step2Files';
import { Loader, Form, FormInput } from '../../../partials';
import _ from 'underscore';


@inject("stores")
@observer
class WizardStep2 extends Component {
    @observable activeTabId = 0;

    setGroupsActiveTabId = (tabId) => {
        this.activeTabId = tabId;
    }

    componentWillMount() {
        const { groupsStore } = this.props.stores;
        groupsStore.fetchWizardGroups();
        this.setGroupsActiveTabId(0);
    }

    setWizardData = (groupId) => {
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
        const { groups: chosenGroups } = this.props.wizardData;
        const { groupsStore, featuresStore } = this.props.stores;
        const { alphaPlusEnabled } = featuresStore;

        return (
            !alphaPlusEnabled ?
                (
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
                            />
                        </span>
                )
                :
                (
                    <span>
                        < Tabs
                            tabItemContainerStyle={{ backgroundColor: 'transparent' }
                            }
                            inkBarStyle={{ display: 'none' }}
                        >
                            <Tab
                                label="Select group(s)"
                                className={"tab-item" + (this.activeTabId === 0 ? " tab-item--active" : "")}
                                data-id={0}
                                onActive={this.setGroupsActiveTabId.bind(this, 0)}
                            >
                                {groupsStore.groupsWizardFetchAsync.isFetching ?
                                    <div className="wrapper-center">
                                        <Loader />
                                    </div>
                                    :
                                    <WizardGroupsList
                                        chosenGroups={chosenGroups}
                                        setWizardData={this.setWizardData.bind(this)}
                                    />
                                }
                            </Tab>
                            <Tab
                                label="OLP"
                                className={"tab-item" + (this.activeTabId === 1 ? " tab-item--active" : "")}
                                data-id={1}
                                onActive={this.setGroupsActiveTabId.bind(this, 1)}
                            >
                                <WizardOLPGroupsListItem />
                            </Tab>
                        </Tabs >
                    </span >
                )
        )
    }
}

WizardStep2.propTypes = {
    wizardData: PropTypes.object.isRequired,
    stores: PropTypes.object,
};

export default WizardStep2;

