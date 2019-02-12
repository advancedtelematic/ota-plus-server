/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { action, observable, observe, onBecomeObserved } from 'mobx';

import { Pagination } from 'antd';
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
    toggleCampaign: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { stores } = props;
    const { campaignsStore } = stores;

    this.cancelChange = observe(campaignsStore, change => { this.apply(change)});

    onBecomeObserved(this, 'activeTab', this.onResumeScope);
  }

  componentDidMount() {
    this.fetchCampaignsData(1, LIMIT_CAMPAIGNS_PER_PAGE);
  }

  componentWillUnmount() {
    this.cancelChange();
  }

  onPageChange = (page, pageSize) => {
    this.fetchCampaignsData(page, pageSize);
  };

  showTotalTemplate = (total, range) => (total > 0 ? `${range[0]}-${range[1]} of ${total}` : '');

  onResumeScope = () => {
    const { stores } = this.props;
    const { campaignsStore } = stores;
    this.setActive(campaignsStore.activeTab);
    this.fetchCampaignsData(1, LIMIT_CAMPAIGNS_PER_PAGE);
  };

  apply = change => {
    const { name, newValue } = change;
    if (name === 'activeTab') {
      this.setActive(newValue);
      this.fetchCampaignsData(1, LIMIT_CAMPAIGNS_PER_PAGE);
    }
  };

  @action
  setActive = tab => { this.activeTab = tab };

  @action
  fetchCampaignsData = (page, pageSize) => {
    const { stores } = this.props;
    const { campaignsStore } = stores;

    campaignsStore.fetchCampaigns(this.activeTab, 'campaignsFetchAsync', (page - 1) * pageSize);
  };

  render() {
    const { stores, highlight, showCancelCampaignModal, showDependenciesModal, expandedCampaigns, toggleCampaign, addNewWizard } = this.props;
    const { campaignsStore } = stores;
    const { campaignsFetchAsync } = campaignsStore;

    return (
      <div className='campaigns' ref='list' style={{ height: 'calc(100vh - 193px', width: 'calc(100vw - 60px' }}>
        <ListHeader status={this.activeTab} addNewWizard={addNewWizard} />
        {campaignsFetchAsync[this.activeTab].isFetching ? (
          <div className='wrapper-center'>
            <Loader />
          </div>
        ) : (
          <List
            status={this.activeTab}
            focus={highlight}
            expandedCampaigns={expandedCampaigns}
            showCancelCampaignModal={showCancelCampaignModal}
            showDependenciesModal={showDependenciesModal}
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
