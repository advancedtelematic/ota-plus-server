/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { action, observable, observe, onBecomeObserved } from 'mobx';

import { Pagination } from 'antd';
import _ from 'lodash';
import { List, ListHeader } from '.';
import Loader from '../../partials/Loader';

import { LIMIT_CAMPAIGNS_PER_PAGE, CAMPAIGNS_DEFAULT_TAB } from '../../config';

@inject('stores')
@observer
class ContentPanel extends Component {
  @observable activeTab = CAMPAIGNS_DEFAULT_TAB;

  static propTypes = {
    stores: PropTypes.object,
    expandedCampaigns: PropTypes.array,
    highlight: PropTypes.string,
    addNewWizard: PropTypes.func,
    showCancelCampaignModal: PropTypes.func,
    showDependenciesModal: PropTypes.func,
    showRetryModal: PropTypes.func,
    toggleCampaign: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { stores } = props;
    const { campaignsStore } = stores;

    this.cancelObserveTabChange = observe(campaignsStore, change => {
      this.applyTab(change);
    });

    onBecomeObserved(this, 'activeTab', this.resumeScope);
  }

  componentDidMount() {
    this.fetchCampaignsData(1, LIMIT_CAMPAIGNS_PER_PAGE);
  }

  componentWillUnmount() {
    this.cancelObserveTabChange();
  }

  @action
  setActive = tab => {
    this.activeTab = tab;
  };

  onPageChange = (page, pageSize) => {
    this.fetchCampaignsData(page, pageSize);
  };

  showTotalTemplate = (total, range) => (total > 0 ? `${range[0]}-${range[1]} of ${total}` : '');

  resumeScope = () => {
    const { stores, highlight, toggleCampaign } = this.props;
    const { campaignsStore } = stores;

    this.setActive(campaignsStore.activeTab);
    this.fetchCampaignsData(1, LIMIT_CAMPAIGNS_PER_PAGE);

    /**
     * Since data set of latest active campaigns is a subset of all campaigns in general
     * it is safe to treat prop "highlight" as given.
     *
     * A search for a campaign with "highlight" equal to campaign.id as formerly implemented
     * is not necessary. It's sufficient to push a faked campaign object with {id: highlight}
     * into array of expanded campaigns. Based on this information List component can accordingly set
     * the correct campaign as expanded.
     */
    if (!_.isUndefined(highlight) && _.isString(highlight) && !_.isEmpty(highlight)) {
      toggleCampaign({id: highlight});
    }
  };

  applyTab = change => {
    const { name, newValue } = change;

    if (name === 'activeTab') {
      this.setActive(newValue);
      this.fetchCampaignsData(1, LIMIT_CAMPAIGNS_PER_PAGE);
    }
  };

  fetchCampaignsData = (page, pageSize) => {
    const { stores } = this.props;
    const { campaignsStore } = stores;

    campaignsStore.fetchCampaigns(this.activeTab, 'campaignsFetchAsync', (page - 1) * pageSize);
  };

  render() {
    const { stores, showCancelCampaignModal, showDependenciesModal, showRetryModal, expandedCampaigns, toggleCampaign, addNewWizard } = this.props;
    const { campaignsStore } = stores;
    const { campaignsFetchAsync } = campaignsStore;

    return (
      <div className='campaigns' ref='list'>
        <ListHeader status={this.activeTab} addNewWizard={addNewWizard} />
        {campaignsFetchAsync[this.activeTab].isFetching ? (
          <div className='wrapper-center'>
            <Loader />
          </div>
        ) : (
          <List
            status={this.activeTab}
            expandedCampaigns={expandedCampaigns}
            showCancelCampaignModal={showCancelCampaignModal}
            showDependenciesModal={showDependenciesModal}
            showRetryModal={showRetryModal}
            toggleCampaign={toggleCampaign}
          />
        )}
        <div className='ant-pagination__wrapper clearfix'>
          <Pagination
            defaultPageSize={LIMIT_CAMPAIGNS_PER_PAGE}
            // hideOnSinglePage
            onChange={this.onPageChange}
            total={campaignsStore.count[this.activeTab]}
            showTotal={this.showTotalTemplate}
          />
        </div>
      </div>
    );
  }
}

export default ContentPanel;
