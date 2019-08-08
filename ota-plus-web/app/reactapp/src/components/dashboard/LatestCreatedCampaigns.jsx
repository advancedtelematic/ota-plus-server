/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import { Loader } from '../../partials';
import LatestCreatedCampaignItem from './LatestCreatedCampaignItem';
import NoItems from './NoItems';

import { CAMPAIGNS_LIMIT_LATEST } from '../../config';

@inject('stores')
@observer
class LatestCreatedCampaigns extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    addNewWizard: PropTypes.func,
    t: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.resumeScope();
  }

  createCampaign = (e) => {
    const { addNewWizard } = this.props;
    e.preventDefault();
    addNewWizard();
  };

  resumeScope = () => {
    this.fetchLatestCampaignsData();
  };

  fetchLatestCampaignsData = () => {
    const { stores } = this.props;
    const { campaignsStore } = stores;
    campaignsStore.fetchLatestCampaigns(CAMPAIGNS_LIMIT_LATEST);
  };

  render() {
    const { stores, t } = this.props;
    const { campaignsStore } = stores;
    const { campaignsLatestFetchAsync, latestCampaigns } = campaignsStore;

    return (
      <span style={{ height: '100%' }}>
        {campaignsLatestFetchAsync.isFetching ? (
          <div className="wrapper-center">
            <Loader />
          </div>
        ) : latestCampaigns.length ? (
          _.map(latestCampaigns, campaign => <LatestCreatedCampaignItem campaign={campaign} key={campaign.id} />)
        ) : (
          <NoItems
            actionText={t('dashboard.no_items.action_campaigns')}
            description={t('dashboard.no_items.desc_campaigns')}
            createItem={this.createCampaign}
          />
        )}
      </span>
    );
  }
}

export default withTranslation()(LatestCreatedCampaigns);
