/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { CampaignSubHeader, CampaignInstallationReportView } from '../campaign';
import { getCampaignSummaryData } from '../../helpers/campaignHelper';

const AUTO_REFRESH_TIME = 10000;
const CHART_PERCENTAGE_FACTOR = 10;

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

  pluralizeDevices = (amount) => {
    return amount === 1 ? `${amount} device ` : `${amount} devices `;
  };

  render() {
    const { stores, showCancelCampaignModal, showDependenciesModal, hideCancel, showRetryModal } = this.props;
    const { campaignsStore } = stores;
    const { campaign } = campaignsStore;
    const {
      affectedCount,
      failedCount,
      failedRate,
      successRate,
      installingCount,
      installingRate,
      notApplicableCount,
      notApplicableRate,
      processedCount,
      successCount
    } = getCampaignSummaryData(campaign.statistics, CHART_PERCENTAGE_FACTOR);

    return (
      <div className='statistics'>
        <CampaignSubHeader campaign={campaign} showCancelCampaignModal={showCancelCampaignModal} hideCancel={hideCancel} />
        <div className='statistics__wrapper'>
          <div className='statistics__progress'>
            <div className='statistics__box-title'>{'Total progress'}</div>
            <div className='statistics__blocks'>
              <div className='statistics__processed'>
                <span className='statistics__count' id='campaign-detail-devices-stats-processed'>
                  {processedCount}
                </span>
                {'Processed'}
              </div>
              <div className='statistics__affected'>
                <span className='statistics__count' id='campaign-detail-devices-stats-affected'>
                  {affectedCount}
                </span>
                {'Affected'}
              </div>
            </div>
            <div className='statistics__installation'>
              <div className='statistics__bar-wrapper'>
                <div className='statistics__bar'>
                  <div className='statistics__bar-item statistics__bar-item--failure' style={{ width: `${failedRate}%` }} />
                  <div className='statistics__bar-item statistics__bar-item--success' style={{ width: `${successRate}%` }} />
                  <div className='statistics__bar-item statistics__bar-item--queued' style={{ width: `${installingRate}%` }} />
                  <div className='statistics__bar-item statistics__bar-item--not-impacted' style={{ width: `${notApplicableRate}%` }} />
                </div>
                <div className='statistics__legend'>
                  <div className='statistics__legend-item'>
                    <span className='statistics__legend-item-color statistics__legend-item-color--failure' />
                    <span>Failed: </span>
                    <span id='target_stats_failure'>
                      {`${this.pluralizeDevices(failedCount)} (${failedRate} %)`}
                    </span>
                  </div>
                  <div className='statistics__legend-item'>
                    <span className='statistics__legend-item-color statistics__legend-item-color--success' />
                    <span>Successful: </span>
                    <span id='target_stats_success'>
                      {`${this.pluralizeDevices(successCount)} (${successRate} %)`}
                    </span>
                  </div>
                  <div className='statistics__legend-item'>
                    <span className='statistics__legend-item-color statistics__legend-item-color--queued' />
                    <span>Installing: </span>
                    <span id='target_stats_queued'>
                      {`${this.pluralizeDevices(installingCount)} (${installingRate} %)`}
                    </span>
                  </div>
                  <div className='statistics__legend-item'>
                    <span className='statistics__legend-item-color statistics__legend-item-color--not-proceed' />
                    <span>Not applicable: </span>
                    <span id='target_stats_not_proceed'>
                      {`${this.pluralizeDevices(notApplicableCount)} (${notApplicableRate} %)`}
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
          {campaign.statistics.failures.length > 0
          && <CampaignInstallationReportView showRetryModal={showRetryModal} />}
        </div>
      </div>
    );
  }
}

export default StatisticsDetails;
