/** @format */

import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import { Doughnut } from 'react-chartjs';
import { FlatButton } from 'material-ui';
import { Loader } from '../../partials';
import StatisticsDetails from './StatisticsDetails';

@inject('stores')
@observer
class Statistics extends Component {
  componentWillMount() {
    const { campaignsStore } = this.props.stores;
    campaignsStore.fetchCampaign(this.props.campaignId);
  }

  render() {
    const { showCancelCampaignModal, showDependenciesModal, hideCancel } = this.props;
    const { campaignsStore } = this.props.stores;
    return (
      <div>
        {campaignsStore.campaignsSingleFetchAsync.isFetching || campaignsStore.campaignsSingleStatisticsFetchAsync.isFetching ? (
          <div className='wrapper-center wrapper-center--dark'>
            <Loader />
          </div>
        ) : (
          <StatisticsDetails showCancelCampaignModal={showCancelCampaignModal} showDependenciesModal={showDependenciesModal} hideCancel={hideCancel} />
        )}
      </div>
    );
  }
}

Statistics.propTypes = {};

export default Statistics;
