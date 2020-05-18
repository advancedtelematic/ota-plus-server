/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';
import { Tabs, Tag } from 'antd';
import { withTranslation } from 'react-i18next';

import { WizardGroupsList, WizardOLPGroupsListItem } from './step2Files';
import { Loader } from '../../../partials';
import { ALPHA_TAG, FEATURES } from '../../../config';

const { TabPane } = Tabs;

@inject('stores')
@observer
class WizardStep2 extends Component {
  @observable activeTabId = 0;

  static propTypes = {
    stores: PropTypes.shape({}),
    wizardData: PropTypes.shape({}),
    markStepAsFinished: PropTypes.func.isRequired,
    markStepAsNotFinished: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { stores } = this.props;
    const { groupsStore } = stores;
    groupsStore.fetchWizardGroups();
    this.setActiveTab(0);
  }

  setActiveTab = (id) => {
    this.activeTabId = id;
  };

  setWizardData = (groupId) => {
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
    const { stores, wizardData, t } = this.props;
    const { groups: chosenGroups } = wizardData;
    const { groupsStore, featuresStore } = stores;
    const { features } = featuresStore;

    return !features.includes(FEATURES.OLP_CAMPAIGN) ? (
      groupsStore.groupsWizardFetchAsync.isFetching ? (
        <div className="wrapper-center">
          <Loader />
        </div>
      ) : (
        <div>
          <h3>{t('campaigns.wizard.select_groups')}</h3>
          <WizardGroupsList chosenGroups={chosenGroups} setWizardData={this.setWizardData} />
        </div>
      )
    ) : (
      <Tabs className="campaigns-wizard__tabs" onChange={this.setActiveTab}>
        <TabPane key="0" tab={t('campaigns.wizard.select_groups')}>
          {groupsStore.groupsWizardFetchAsync.isFetching ? (
            <div className="wrapper-center">
              <Loader />
            </div>
          ) : (
            <WizardGroupsList chosenGroups={chosenGroups} setWizardData={this.setWizardData} />
          )}
        </TabPane>
        <TabPane
          key="1"
          tab={(
            <div>
                OLP
              <Tag color="#00B6B2" className="alpha-tag">{ALPHA_TAG}</Tag>
            </div>
            )}
        >
          <WizardOLPGroupsListItem />
        </TabPane>
      </Tabs>
    );
  }
}

export default withTranslation()(WizardStep2);
