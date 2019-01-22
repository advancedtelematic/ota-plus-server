/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import moment from 'moment';

import { Loader } from '../../partials';

@observer
class CampaignSummary extends Component {
  static propTypes = {
    campaign: PropTypes.object,
    type: PropTypes.string,
    toggle: PropTypes.func,
  };

  render() {
    const { campaign, type, toggle } = this.props;
    const notInPreparation = type !== 'prepared';

    let totalAffected = 0;
    let totalProcessed = 0;
    let totalFinished = 0;
    let totalFailed = 0;
    let failureRate = 0;

    if (type === 'launched' || type === 'finished') {
      const { stats } = campaign.summary;
      totalFailed = campaign.summary.failed.length;
      totalFinished = campaign.summary.finished;
      _.each(stats, stat => {
        totalAffected += stat.affected;
        totalProcessed += stat.processed;
      });
      failureRate = Math.round((totalFailed / Math.max(totalFinished, 1)) * 100);
    }

    return (
      <div
        className='campaigns__item'
        id={`item-${campaign.id}`}
        onClick={e => {
          toggle(campaign, e);
        }}
      >
        <div className='campaigns__column' id={`campaign-name-${campaign.id}`}>
          {campaign.name}
        </div>
        <div className='campaigns__column' id={`campaign-start-date-${campaign.id}`}>
          {moment(campaign.createdAt).format('DD.MM.YYYY')}
        </div>
        {notInPreparation && (
          <div className='campaigns__column' id={`campaign-processed-${campaign.id}`}>
            <span>
              <span>{totalProcessed}</span>
            </span>
          </div>
        )}
        {notInPreparation && (
          <div className='campaigns__column' id={`campaign-affected-${campaign.id}`}>
            <span>
              <span>{totalAffected}</span>
            </span>
          </div>
        )}
        {notInPreparation && (
          <div className='campaigns__column' id={`campaign-finished-${campaign.id}`}>
            <span>
              <span>{`${totalFinished} / ${totalAffected}`}</span>
            </span>
          </div>
        )}
        {notInPreparation && (
          <div className='campaigns__column' id={`campaign-failure-rate-${campaign.id}`}>
            <span>
              <span>{`${failureRate} %`}</span>
            </span>
          </div>
        )}
        <div className='campaigns__column campaigns__column--additional-info' id={`campaign-additional-info-${campaign.id}`}>
          {notInPreparation ? (
            <div id='campaign-more-info'>{'More info'}</div>
          ) : (
            <div className='wrapper-center'>
              <Loader size={30} thickness={5} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CampaignSummary;
