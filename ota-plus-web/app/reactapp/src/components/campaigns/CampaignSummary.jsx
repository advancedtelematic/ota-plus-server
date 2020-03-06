/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from 'antd';
import { withTranslation } from 'react-i18next';
import { Loader } from '../../partials';
import { getCampaignSummaryData } from '../../helpers/campaignHelper';
import { CAMPAIGN_SUMMARY_CREATED_DATE_FORMAT } from '../../constants/datesTimesConstants';
import { getFormattedDateTime } from '../../helpers/datesTimesHelper';

import {
  CAMPAIGNS_STATUS_FINISHED,
  CAMPAIGNS_STATUS_LAUNCHED,
  CAMPAIGNS_STATUS_PREPARED,
  CAMPAIGNS_STATUS_TAB_TITLE
} from '../../config';

const LOADER_CONFIG = {
  SIZE: 30,
  THICKNESS: 5
};

@observer
class CampaignSummary extends Component {
  static propTypes = {
    campaign: PropTypes.shape({}).isRequired,
    toggle: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  render() {
    const { campaign, toggle, t } = this.props;
    const type = campaign.status;
    const notInPreparation = type !== CAMPAIGNS_STATUS_PREPARED;

    let processedCount = 0;
    let failedCount = 0;
    let failedRate = 0;
    let successCount = 0;
    let successRate = 0;
    let installingCount = 0;
    let installingRate = 0;
    let notApplicableCount = 0;
    let notApplicableRate = 0;

    if (campaign.summary && (type === CAMPAIGNS_STATUS_LAUNCHED || type === CAMPAIGNS_STATUS_FINISHED)) {
      ({
        processedCount,
        failedCount,
        failedRate,
        successCount,
        successRate,
        installingCount,
        installingRate,
        notApplicableCount,
        notApplicableRate
      } = getCampaignSummaryData(campaign.summary));
    }

    return (
      <div
        className="campaigns__item"
        id={`item-${campaign.id}`}
        onClick={(event) => {
          toggle(campaign, event);
        }}
      >
        <div className="campaigns__column" id={`campaign-name-${campaign.id}`}>
          {campaign.name}
        </div>
        <div className="campaigns__column" id={`campaign-start-date-${campaign.id}`}>
          {getFormattedDateTime(campaign.createdAt, CAMPAIGN_SUMMARY_CREATED_DATE_FORMAT)}
        </div>
        <div className="campaigns__column" id={`campaign-status-${campaign.id}`}>
          {CAMPAIGNS_STATUS_TAB_TITLE[type]}
        </div>
        {notInPreparation && (
          <div className="campaigns__column" id={`campaign-selected-devices-${campaign.id}`}>
            <span>
              <span>{processedCount}</span>
            </span>
          </div>
        )}
        {notInPreparation && (
          <div className="campaigns__column" id={`campaign-failed-${campaign.id}`}>
            <span>
              <Tooltip title={t('devices.device_count', { count: failedCount })}>
                <span>{`${failedRate} %`}</span>
              </Tooltip>
            </span>
          </div>
        )}
        {notInPreparation && (
          <div className="campaigns__column" id={`campaign-successful-${campaign.id}`}>
            <span>
              <Tooltip title={t('devices.device_count', { count: successCount })}>
                <span>{`${successRate} %`}</span>
              </Tooltip>
            </span>
          </div>
        )}
        {notInPreparation && (
          <div className="campaigns__column" id={`campaign-installing-${campaign.id}`}>
            <span>
              <Tooltip title={t('devices.device_count', { count: installingCount })}>
                <span>{`${installingRate} %`}</span>
              </Tooltip>
            </span>
          </div>
        )}
        {notInPreparation && (
          <div className="campaigns__column" id={`campaign-not-applicable-${campaign.id}`}>
            <span>
              <Tooltip title={t('devices.device_count', { count: notApplicableCount })}>
                <span>{`${notApplicableRate} %`}</span>
              </Tooltip>
            </span>
          </div>
        )}
        <div className="campaigns__column campaigns__column--additional-info" id={`campaign-additional-info-${campaign.id}`}>
          {notInPreparation ? (
            <div id="campaign-more-info">{t('campaigns.more_info')}</div>
          ) : (
            <div className="wrapper-center">
              <Loader size={LOADER_CONFIG.SIZE} thickness={LOADER_CONFIG.THICKNESS} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withTranslation()(CampaignSummary);
