/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';
import { Tabs } from 'antd';
import { WizardGroupsList, WizardOLPGroupsListItem } from './step2Files';
import { Loader } from '../../../partials';

const { TabPane } = Tabs;

@inject('stores')
@observer
class WizardStep2 extends Component {
  @observable activeTabId = 0;

  static propTypes = {
    stores: PropTypes.object,
    wizardData: PropTypes.object,
    markStepAsFinished: PropTypes.func.isRequired,
    markStepAsNotFinished: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { stores } = this.props;
    const { groupsStore } = stores;
    groupsStore.fetchWizardGroups();
    this.setActiveTab(0);
  }

  setActiveTab = id => {
    this.activeTabId = id;
  };

  setWizardData = groupId => {
    const { stores, wizardData, markStepAsFinished, markStepAsNotFinished } = this.props;
    const { groupsStore } = stores;
    const { groups } = wizardData;

    const groupsIndex = _.findIndex(groups, item => item.id === groupId);
    const groupToAdd = _.find(groupsStore.wizardGroups, { id: groupId });

    if (groupsIndex >= 0) {
      groups.splice(groupsIndex, 1);
    } else {
      groups.push(groupToAdd);
    }

    if (groups.length) {
      markStepAsFinished();
    } else {
      markStepAsNotFinished();
    }
  };

  render() {
    const { stores, wizardData } = this.props;
    const { groups: chosenGroups } = wizardData;
    const { groupsStore, featuresStore } = stores;
    const { alphaPlusEnabled } = featuresStore;

    return !alphaPlusEnabled ? (
      groupsStore.groupsWizardFetchAsync.isFetching ? (
        <div className='wrapper-center'>
          <Loader />
        </div>
      ) : (
        <div>
          <h3>{'Select group(s)'}</h3>
          <WizardGroupsList chosenGroups={chosenGroups} setWizardData={this.setWizardData} />
        </div>
      )
    ) : (
      <Tabs onChange={this.setActiveTab}>
        <TabPane key='0' tab='Select group(s)'>
          {groupsStore.groupsWizardFetchAsync.isFetching ? (
            <div className='wrapper-center'>
              <Loader />
            </div>
          ) : (
            <WizardGroupsList chosenGroups={chosenGroups} setWizardData={this.setWizardData} />
          )}
        </TabPane>
        <TabPane key='1' tab='OLP'>
          <WizardOLPGroupsListItem />
        </TabPane>
      </Tabs>
    );
  }
}

export default WizardStep2;
