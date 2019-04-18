/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';

import { Loader } from '../../partials';
import { getCampaignSummaryData } from '../../helpers/campaignHelper';

import {
  CAMPAIGNS_STATUS_FINISHED,
  CAMPAIGNS_STATUS_LAUNCHED,
  CAMPAIGNS_STATUS_PREPARED,
  CAMPAIGNS_STATUS_TAB_TITLE
} from '../../config';

@observer
class CampaignSummary extends Component {
  static propTypes = {
    campaign: PropTypes.shape({}).isRequired,
    toggle: PropTypes.func.isRequired,
  };

  render() {
    const { campaign, toggle } = this.props;
    const type = campaign.status;
    const notInPreparation = type !== CAMPAIGNS_STATUS_PREPARED;

    let processedCount = 0;
    let failedRate = 0;
    let successRate = 0;
    let installingRate = 0;
    let notApplicableRate = 0;

    if (campaign.summary && (type === CAMPAIGNS_STATUS_LAUNCHED || type === CAMPAIGNS_STATUS_FINISHED)) {
      ({
        processedCount, failedRate, successRate, installingRate, notApplicableRate
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
          {moment(campaign.createdAt).format('DD.MM.YYYY HH:mm')}
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
              <span>{`${failedRate} %`}</span>
            </span>
          </div>
        )}
        {notInPreparation && (
          <div className="campaigns__column" id={`campaign-successful-${campaign.id}`}>
            <span>
              <span>{`${successRate} %`}</span>
            </span>
          </div>
        )}
        {notInPreparation && (
          <div className="campaigns__column" id={`campaign-installing-${campaign.id}`}>
            <span>
              <span>{`${installingRate} %`}</span>
            </span>
          </div>
        )}
        {notInPreparation && (
          <div className="campaigns__column" id={`campaign-not-applicable-${campaign.id}`}>
            <span>
              <span>{`${notApplicableRate} %`}</span>
            </span>
          </div>
        )}
        <div className="campaigns__column campaigns__column--additional-info" id={`campaign-additional-info-${campaign.id}`}>
          {notInPreparation ? (
            <div id="campaign-more-info">{'More info'}</div>
          ) : (
            <div className="wrapper-center">
              <Loader size={30} thickness={5} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CampaignSummary;
