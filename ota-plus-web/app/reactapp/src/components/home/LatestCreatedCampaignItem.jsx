/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import _ from 'lodash';

@inject('stores')
@observer
class LatestCreatedCampaignItem extends Component {
  static propTypes = {
    stores: PropTypes.object,
    campaign: PropTypes.object,
    history: PropTypes.object.isRequired,
  };

  /*
   * ToDo: onClick handler is workaround but should be switched using router and proper path to navigate
   */
  onClick = e => {
    const { stores, campaign, history } = this.props;
    const { campaignsStore } = stores;
    if (e) e.preventDefault();

    campaignsStore.activeTab = campaign.summary.status;

    history.push(`/campaigns/${campaign.id}`);
  };

  getBriefKeyData = campaign => {
    const { summary } = campaign;
    const keyData = {
      totalFailed: summary.failed.length,
      totalFinished: summary.finished,
      totalAffected: summary.affected,
    };

    keyData.failureRate = Math.round((keyData.totalFailed / Math.max(keyData.totalFinished, 1)) * 100);

    return keyData;
  };

  render() {
    const { campaign } = this.props;
    const keyData = this.getBriefKeyData(campaign);

    return (
      <div className='home__list-item' title={campaign.name} id={`link-campaign__wizard-${campaign.id}`} onClick={this.onClick}>
        <div className='home__body-col'>{campaign.name}</div>
        <div className='home__body-col'>
          {keyData.totalFinished}/{keyData.totalAffected}
        </div>
        <div className='home__body-col'>{keyData.failureRate}%</div>
      </div>
    );
  }
}

// ugly workaround to get react-router's history property available for a redirection after click on item
export default withRouter(LatestCreatedCampaignItem);
