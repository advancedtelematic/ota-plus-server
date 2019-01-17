/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import _ from 'lodash';

@observer
class ActiveCampaignItem extends Component {
  render() {
    const { campaign } = this.props;
    const link = 'campaigns/' + campaign.id;
    let totalFailed = 0;
    let totalFinished = 0;
    let totalAffected = 0;
    let failureRate = 0;
    const stats = campaign.summary.stats;
    _.each(stats, (stat, groupId) => {
      totalAffected += stat.affected;
    });
    totalFailed = campaign.summary.failed.length;
    totalFinished = campaign.summary.finished;
    failureRate = Math.round((totalFailed / Math.max(totalFinished, 1)) * 100);
    return (
      <Link to={`${link}`} className='home__list-item' title={campaign.name} id={'link-campaignwizard-' + campaign.id}>
        <div className='home__body-col'>{campaign.name}</div>
        <div className='home__body-col'>
          {totalFinished}/{totalAffected}
        </div>
        <div className='home__body-col'>{failureRate}%</div>
      </Link>
    );
  }
}

ActiveCampaignItem.propTypes = {};

export default ActiveCampaignItem;
