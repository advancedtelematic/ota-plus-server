/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Loader } from '../../partials';
import StatisticsDetails from './StatisticsDetails';

@inject('stores')
@observer
class Statistics extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    campaignId: PropTypes.string,
    showCancelCampaignModal: PropTypes.func,
    showDependenciesModal: PropTypes.func,
    hideCancel: PropTypes.bool,
    showRetryModal: PropTypes.func
  };

  componentWillMount() {
    const { stores, campaignId } = this.props;
    const { campaignsStore } = stores;
    campaignsStore.fetchCampaign(campaignId);
  }

  render() {
    const { stores, showCancelCampaignModal, showDependenciesModal, showRetryModal, hideCancel } = this.props;
    const { campaignsStore } = stores;
    return (
      <div>
        {campaignsStore.campaignsSingleFetchAsync.isFetching
          || campaignsStore.campaignsSingleStatisticsFetchAsync.isFetching ? (
            <div className="wrapper-center wrapper-center--dark">
              <Loader />
            </div>
          ) : (
            <StatisticsDetails
              showCancelCampaignModal={showCancelCampaignModal}
              showDependenciesModal={showDependenciesModal}
              showRetryModal={showRetryModal}
              hideCancel={hideCancel}
            />
          )}
      </div>
    );
  }
}

export default Statistics;
