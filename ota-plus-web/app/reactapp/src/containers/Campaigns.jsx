/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';

import { DependenciesModal } from '../partials';
import { resetAsync } from '../utils/Common';
import { CampaignsContentPanel } from '../components/campaigns';
import { CampaignCancelCampaignModal } from '../components/campaign';

@inject('stores')
@observer
class Campaigns extends Component {
  static propTypes = {
    stores: PropTypes.object,
    activeTab: PropTypes.string,
    switchTab: PropTypes.func,
    highlight: PropTypes.string,
    addNewWizard: PropTypes.func,
  };
  @observable
  cancelCampaignModalShown = false;
  @observable
  dependenciesModalShown = false;
  @observable
  activeCampaign = null;
  @observable
  expandedCampaigns = [];
  toggle = campaign => {
    if (!_.isEqual(this.expandedCampaigns.pop(), campaign)) {
      this.expandedCampaigns.push(campaign);
    }
  };

  showWizard = campaignId => {
    this.campaignIdToAction = campaignId;
  };

  showCancelCampaignModal = e => {
    if (e) e.preventDefault();
    this.cancelCampaignModalShown = true;
  };

  hideCancelCampaignModal = e => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { campaignsStore } = stores;
    this.cancelCampaignModalShown = false;
    resetAsync(campaignsStore.campaignsCancelAsync);
  };

  showDependenciesModal = (activeCampaign, e) => {
    if (e) e.preventDefault();
    this.dependenciesModalShown = true;
    this.activeCampaign = activeCampaign;
  };

  hideDependenciesModal = e => {
    if (e) e.preventDefault();
    this.dependenciesModalShown = false;
    this.activeCampaign = null;
  };

  changeSort = (sort, e) => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { campaignsStore } = stores;
    campaignsStore._prepareCampaigns(campaignsStore.campaignsFilter, sort);
  };

  changeFilter = filter => {
    const { stores } = this.props;
    const { campaignsStore } = stores;
    campaignsStore._prepareCampaigns(filter, campaignsStore.campaignsSort);
  };

  render() {
    const { addNewWizard, highlight, activeTab, switchTab } = this.props;

    return (
      <div>
        <CampaignsContentPanel
          status={activeTab}
          highlight={highlight}
          expandedCampaigns={this.expandedCampaigns}
          toggleCampaign={this.toggle}
          addNewWizard={addNewWizard}
          showWizard={this.showWizard}
          showCancelCampaignModal={this.showCancelCampaignModal}
          showDependenciesModal={this.showDependenciesModal}
        />
        <CampaignCancelCampaignModal shown={this.cancelCampaignModalShown} hide={this.hideCancelCampaignModal} switchTab={switchTab} />
        {this.dependenciesModalShown && <DependenciesModal shown={this.dependenciesModalShown} hide={this.hideDependenciesModal} activeItemName={this.activeCampaign} />}
      </div>
    );
  }
}

export default Campaigns;
