import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { Tabs, Tab } from 'material-ui/Tabs';
import { WizardGroupsList } from './step2Files';
import { Loader, Form, FormInput } from '../../../partials';
import _ from 'underscore';

const fakeOLP = {
    groupName: "VINs Dynamic Config Campaign UPD66371823-Overheat",
    layerID: "lchu201808010911",
    link: "https://platform.here.com/data/hrn:here:data:::chu2018080109505/lchu201808010911"
}

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
        const { alphaTestEnabled } = featuresStore;
        const groups = (
            groupsStore.groupsWizardFetchAsync.isFetching ?
                <div className="wrapper-center">
                    <Loader />
                </div>
                :
                <WizardGroupsList
                    chosenGroups={chosenGroups}
                    setWizardData={this.setWizardData.bind(this)}
                />

        )
        const groupsOLP = (
            <span>
                <div className="ios-list" ref="list">
                    <div className="fake-header">
                        V
                    </div>
                    <div className="header"></div>
                    <div className={"item "} >
                        <div className={"btn-checkbox"}>
                            <i className="fa fa-check" aria-hidden="true" />
                        </div>
                        <div className="element-box olpgroup">
                            <div className="desc">
                                <div className="title">
                                    {fakeOLP.groupName}
                                </div>
                                <div className="subtitle">
                                    <span className="layer">
                                        Layer
                                    </span>
                                    <span className="versioned">
                                        Versioned
                                    </span>
                                    <span>
                                        Layer ID: {fakeOLP.layerID}
                                    </span>
                                </div>
                            </div>
                            <a href={fakeOLP.link} target="_blank"><div className="icon" /></a>
                        </div>
                    </div>
                </div>
            </span>
        )

        return (
            !alphaTestEnabled ?
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
                                {groups}
                            </Tab>
                            <Tab
                                label="OLP"
                                className={"tab-item" + (this.activeTabId === 1 ? " tab-item--active" : "")}
                                data-id={1}
                                onActive={this.setGroupsActiveTabId.bind(this, 1)}
                            >
                                {groupsOLP}
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

