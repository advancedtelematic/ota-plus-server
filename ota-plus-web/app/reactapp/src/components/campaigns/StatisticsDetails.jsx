/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { withTranslation } from 'react-i18next';

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
    t: PropTypes.func.isRequired
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
    const { stores, showCancelCampaignModal, showDependenciesModal, hideCancel, showRetryModal, t } = this.props;
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
            <div className='statistics__box-title'>{t('devices.statistics.total_progress')}</div>
            <div className='statistics__blocks'>
              <div className='statistics__processed'>
                <span className='statistics__count' id='campaign-detail-devices-stats-processed'>
                  {processedCount}
                </span>
                {t('devices.statistics.processed')}
              </div>
              <div className='statistics__affected'>
                <span className='statistics__count' id='campaign-detail-devices-stats-affected'>
                  {affectedCount}
                </span>
                {t('devices.statistics.affected')}
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
                    <span>{t('devices.statistics.failed')}</span>
                    <span id='target_stats_failure'>
                      {`${t('devices.device_count', { count: failedCount })} (${failedRate} %)`}
                    </span>
                  </div>
                  <div className='statistics__legend-item'>
                    <span className='statistics__legend-item-color statistics__legend-item-color--success' />
                    <span>{t('devices.statistics.successful')}</span>
                    <span id='target_stats_success'>
                      {`${t('devices.device_count', { count: successCount })} (${successRate} %)`}
                    </span>
                  </div>
                  <div className='statistics__legend-item'>
                    <span className='statistics__legend-item-color statistics__legend-item-color--queued' />
                    <span>{t('devices.statistics.installing')}</span>
                    <span id='target_stats_queued'>
                      {`${t('devices.device_count', { count: installingCount })} (${installingRate} %)`}
                    </span>
                  </div>
                  <div className='statistics__legend-item'>
                    <span className='statistics__legend-item-color statistics__legend-item-color--not-proceed' />
                    <span>{t('devices.statistics.not_applicable')}</span>
                    <span id='target_stats_not_proceed'>
                      {`${t('devices.device_count', { count: notApplicableCount })} (${notApplicableRate} %)`}
                    </span>
                  </div>
                </div>
              </div>
              <div className='statistics__dependencies'>
                <a className='add-button' id='target_show_dependencies' onClick={showDependenciesModal.bind(this, campaignsStore.campaign.name)}>
                  <span>{t('devices.statistics.show_dependencies')}</span>
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

export default withTranslation()(StatisticsDetails);
