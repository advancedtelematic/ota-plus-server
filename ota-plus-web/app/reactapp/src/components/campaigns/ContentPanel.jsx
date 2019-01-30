/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { Divider, Pagination } from 'antd';
import { List, ListHeader } from '.';
import Loader from '../../partials/Loader';

import { LIMIT_CAMPAIGNS_PER_PAGE } from '../../config';

@inject('stores')
@observer
class ContentPanel extends Component {
  static propTypes = {
    stores: PropTypes.object,
    status: PropTypes.string,
    expandedCampaigns: PropTypes.array,
    highlight: PropTypes.string,
    addNewWizard: PropTypes.func,
    showCancelCampaignModal: PropTypes.func,
    showDependenciesModal: PropTypes.func,
    toggleCampaign: PropTypes.func,
  };

  onPageChange = (page, pageSize) => {
    const { stores, status } = this.props;
    const { campaignsStore } = stores;

    campaignsStore.fetchCampaigns(status, 'campaignsFetchAsync',(page - 1) * pageSize);
  };

  showTotalTemplate = (total, range) => total > 0 ? `${range[0]}-${range[1]} of ${total}` : '';

  render() {
    const { stores } = this.props;
    const { campaignsStore } = stores;
    const { campaignsFetchAsync } = campaignsStore;
    const { status, highlight, showCancelCampaignModal, showDependenciesModal, expandedCampaigns, toggleCampaign, addNewWizard } = this.props;

    return (
      <div className='campaigns' ref='list' style={{height: 'calc(100vh - 193px', width: 'calc(100vw - 60px'}}>
        <ListHeader status={status} addNewWizard={addNewWizard} />
        {campaignsFetchAsync[status].isFetching ? (
          <div className='wrapper-center'>
            <Loader />
          </div>
        ) : (
          <List
            status={status}
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
            total={campaignsStore.count[status]}
            showTotal={this.showTotalTemplate}
          />
        </div>
      </div>

    );
  }
}

export default ContentPanel;
