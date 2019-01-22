/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';
import { Doughnut } from 'react-chartjs-2';
import { CampaignGroupsList, CampaignSubHeader, CampaignInstallationReportView } from '../campaign';

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

  render() {
    const { stores, showCancelCampaignModal, showDependenciesModal, hideCancel } = this.props;
    const { campaignsStore, featuresStore } = stores;
    const { alphaTestEnabled } = featuresStore;
    const { campaign, overallCampaignStatistics } = campaignsStore;
    const failureRateData = [
      {
        value: overallCampaignStatistics.failed,
        color: '#FE0001',
        highlight: '#FE0001',
        label: 'Failure rate',
      },
      {
        value: overallCampaignStatistics.failed === 0 ? 1 : overallCampaignStatistics.finished,
        color: '#44CA9D',
        highlight: '#44CA9D',
        label: 'Success rate',
      },
      {
        value: 0,
        color: '#CCCCCC',
        highlight: '#CCCCCC',
        label: 'Cancelled rate',
      },
    ];

    const stats = {
      datasets: [
        {
          data: [],
          label: [],
          backgroundColor: [],
          hoverBackgroundColor: [],
          borderWidth: 0,
        },
      ],
    };

    _.each(failureRateData, item => {
      stats.datasets[0].data.push(item.value);
      stats.datasets[0].label.push(name.label);
      stats.datasets[0].backgroundColor.push(item.color);
      stats.datasets[0].hoverBackgroundColor.push(item.highlight);
    });

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
          <div className='statistics__box statistics__box--left'>
            <div className='statistics__box-title'>{'Failure rate'}</div>
            <div className='statistics__failure-chart' id='campaign-detail-total-failure-rate'>
              <div className='statistics__failure-chart-wrapper'>
                <Doughnut
                  data={stats}
                  options={{
                    cutoutPercentage: 75,
                  }}
                  width={120}
                  height={120}
                />
              </div>
              <div className='statistics__failure-rate'>{Math.round((overallCampaignStatistics.failed / Math.max(overallCampaignStatistics.finished, 1)) * 100)}%</div>
            </div>
          </div>

          <div className='statistics__box statistics__box--right'>
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
                      <span className='statistics__legend-item-title'>{'Success'}</span>
                      <span className='statistics__legend-item-count' id='target_stats_success'>
                        {overallCampaignStatistics.successful}
                      </span>
                    </div>
                    <div className='statistics__legend-item'>
                      <span className='statistics__legend-item-color statistics__legend-item-color--queued' />
                      <span className='statistics__legend-item-title'>{'Queued'}</span>
                      <span className='statistics__legend-item-count' id='target_stats_queued'>
                        {overallCampaignStatistics.queued}
                      </span>
                    </div>
                    <div className='statistics__legend-item'>
                      <span className='statistics__legend-item-color statistics__legend-item-color--failure' />
                      <span className='statistics__legend-item-title'>{'Failure'}</span>
                      <span className='statistics__legend-item-count' id='target_stats_failure'>
                        {overallCampaignStatistics.failed}
                      </span>
                    </div>
                    <div className='statistics__legend-item'>
                      <span className='statistics__legend-item-color statistics__legend-item-color--not-proceed' />
                      <span className='statistics__legend-item-title'>{'Not processed'}</span>
                      <span className='statistics__legend-item-count' id='target_stats_not_proceed'>
                        {notProcessed}
                      </span>
                    </div>
                    <div className='statistics__legend-item'>
                      <span className='statistics__legend-item-color statistics__legend-item-color--not-impacted' />
                      <span className='statistics__legend-item-title'>{'Not impacted'}</span>
                      <span className='statistics__legend-item-count' id='target_stats_not_impacted'>
                        {overallCampaignStatistics.notImpacted}
                      </span>
                    </div>
                    <div className='statistics__legend-item'>
                      <span className='statistics__legend-item-color statistics__legend-item-color--cancelled' />
                      <span className='statistics__legend-item-title'>{'Cancelled'}</span>
                      <span className='statistics__legend-item-count' id='target_stats_cancelled'>
                        {overallCampaignStatistics.cancelled}
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
            {alphaTestEnabled ? <CampaignInstallationReportView /> : <CampaignGroupsList />}
          </div>
        </div>
      </div>
    );
  }
}

export default StatisticsDetails;
