/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';
import { Doughnut } from 'react-chartjs-2';
import { CampaignSubHeader, CampaignInstallationReportView } from '../campaign';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const AUTO_REFRESH_TIME = 10000;

@inject('stores')
@observer
class StatisticsDetails extends Component {
  @observable tmpIntervalId = null;

  static propTypes = {
    stores: PropTypes.object,
    showCancelCampaignModal: PropTypes.func,
    showDependenciesModal: PropTypes.func,
    hideCancel: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.tmpIntervalId = setInterval(this.autoRefresh, AUTO_REFRESH_TIME);
  }

  componentWillUnmount() {
    clearInterval(this.tmpIntervalId);
  }

  autoRefresh = () => {
    const { stores } = this.props;
    const { campaignsStore } = stores;
    if (campaignsStore.campaign.statistics.status === 'prepared' || campaignsStore.campaign.statistics.status === 'scheduled') {
      campaignsStore.fetchCampaign(campaignsStore.campaign.id);
    }
  };

  pluralizeDevices = amount => {
    return amount === 1 ? `${amount} device ` : `${amount} devices `;
  };

  render() {
    const { stores, showCancelCampaignModal, showDependenciesModal, hideCancel } = this.props;
    const { campaignsStore } = stores;
    const { campaign, overallCampaignStatistics } = campaignsStore;

    const successRate = Math.min(Math.round((overallCampaignStatistics.successful / Math.max(overallCampaignStatistics.processed, 1)) * 100), 100);
    const failureRate = Math.min(Math.round((overallCampaignStatistics.failed / Math.max(overallCampaignStatistics.processed, 1)) * 100), 100);
    const queuedRate = Math.min(Math.round((overallCampaignStatistics.queued / Math.max(overallCampaignStatistics.processed, 1)) * 100), 100);
    const notImpactedRate = Math.min(Math.round((overallCampaignStatistics.notImpacted / Math.max(overallCampaignStatistics.processed, 1)) * 100), 100);

    let totalDevicesAmount = 0;
    _.each(campaignsStore.campaign.groups, group => {
      totalDevicesAmount += group.total;
    });

    const notProcessed = totalDevicesAmount - overallCampaignStatistics.processed;
    const notProcessedRate = Math.min(Math.round((notProcessed / Math.max(overallCampaignStatistics.processed, 1)) * 100), 100);
    const cancelledRate = Math.min(Math.round((overallCampaignStatistics.cancelled / Math.max(overallCampaignStatistics.processed, 1)) * 100), 100);
    return (
      <div className='statistics'>
        <CampaignSubHeader campaign={campaign} showCancelCampaignModal={showCancelCampaignModal} hideCancel={hideCancel} />
        <div className='statistics__wrapper'>
          <div className='statistics__progress'>
            <div className='statistics__box-title'>{'Total progress'}</div>
            <div className='statistics__blocks'>
              <div className='statistics__processed'>
                <span className='statistics__count' id='campaign-detail-devices-stats-processed'>
                  {overallCampaignStatistics.processed}
                </span>
                {'Processed'}
              </div>
              <div className='statistics__affected'>
                <span className='statistics__count' id='campaign-detail-devices-stats-affected'>
                  {overallCampaignStatistics.affected}
                </span>
                {'Affected'}
              </div>
            </div>
            <div className='statistics__installation'>
              <div className='statistics__bar-wrapper'>
                <div className='statistics__bar'>
                  <div className='statistics__bar-item statistics__bar-item--failure' style={{ width: `${failureRate}%` }} />
                  <div className='statistics__bar-item statistics__bar-item--success' style={{ width: `${successRate}%` }} />
                  <div className='statistics__bar-item statistics__bar-item--queued' style={{ width: `${queuedRate}%` }} />
                  <div className='statistics__bar-item statistics__bar-item--not-impacted' style={{ width: `${notImpactedRate}%` }} />
                  <div className='statistics__bar-item statistics__bar-item--not-proceed' style={{ width: `${notProcessedRate}%` }} />
                  <div className='statistics__bar-item statistics__bar-item--cancelled' style={{ width: `${cancelledRate}%` }} />
                </div>
                <div className='statistics__legend'>
                  <div className='statistics__legend-item'>
                    <span className='statistics__legend-item-color statistics__legend-item-color--success' />
                    <span>Success: </span>
                    <span id='target_stats_success'>
                      {this.pluralizeDevices(overallCampaignStatistics.successful)} ({successRate} %)
                    </span>
                  </div>
                  <div className='statistics__legend-item'>
                    <span className='statistics__legend-item-color statistics__legend-item-color--queued' />
                    <span >Queued: </span>
                    <span id='target_stats_queued'>
                      {this.pluralizeDevices(overallCampaignStatistics.queued)} ({queuedRate} %)
                    </span>
                  </div>
                  <div className='statistics__legend-item'>
                    <span className='statistics__legend-item-color statistics__legend-item-color--failure' />
                    <span>Failure: </span>
                    <span id='target_stats_failure'>
                      {this.pluralizeDevices(overallCampaignStatistics.failed)} ({failureRate} %)
                    </span>
                  </div>
                  <div className='statistics__legend-item'>
                    <span className='statistics__legend-item-color statistics__legend-item-color--not-proceed' />
                    <span>Not processed: </span>
                    <span id='target_stats_not_proceed'>
                      {this.pluralizeDevices(notProcessed)} ({notProcessedRate} %)
                    </span>
                  </div>
                  <div className='statistics__legend-item'>
                    <span className='statistics__legend-item-color statistics__legend-item-color--not-impacted' />
                    <span>Not impacted: </span>
                    <span id='target_stats_not_impacted'>
                      {this.pluralizeDevices(overallCampaignStatistics.notImpacted)} ({notImpactedRate} %)
                    </span>
                  </div>
                  <div className='statistics__legend-item'>
                    <span className='statistics__legend-item-color statistics__legend-item-color--cancelled' />
                    <span>Cancelled: </span>
                    <span id='target_stats_cancelled'>
                      {this.pluralizeDevices(overallCampaignStatistics.cancelled)} ({cancelledRate} %)
                    </span>
                  </div>
                </div>
              </div>
              <div className='statistics__dependencies'>
                <a className='add-button' id='target_show_dependencies' onClick={showDependenciesModal.bind(this, campaignsStore.campaign.name)}>
                  <span>{'Show dependencies'}</span>
                </a>
              </div>
            </div>
          </div>
          {campaign.statistics.byResultCode.length ? <CampaignInstallationReportView /> : <div>No failure data has been collected yet. Check back later</div>}
        </div>
      </div>
    );
  }
}

export default StatisticsDetails;
