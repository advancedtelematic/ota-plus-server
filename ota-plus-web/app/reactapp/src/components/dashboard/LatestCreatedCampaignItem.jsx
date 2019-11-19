/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@inject('stores')
@observer
class LatestCreatedCampaignItem extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    campaign: PropTypes.shape({}),
    history: PropTypes.shape({}).isRequired,
  };

  /*
   * ToDo: onClick handler is workaround but should be switched using router and proper path to navigate
   */
  onClick = (e) => {
    const { stores, campaign, history } = this.props;
    const { campaignsStore } = stores;
    if (e) e.preventDefault();

    campaignsStore.activeTab = campaign.summary.status;

    history.push(`/campaigns/${campaign.id}`);
  };

  getBriefKeyData = (campaign) => {
    const { summary } = campaign;
    const keyData = {
      totalFailed: summary ? summary.failed : 0,
      totalFinished: summary ? summary.finished : 0,
      totalAffected: summary ? summary.affected : 0,
    };

    keyData.failureRate = Math.round((keyData.totalFailed / Math.max(keyData.totalAffected, 1)) * 100);

    return keyData;
  };

  render() {
    const { campaign } = this.props;
    const keyData = this.getBriefKeyData(campaign);

    return (
      <div className="dashboard__list-item" title={campaign.name} id={`link-campaign__wizard-${campaign.id}`} onClick={this.onClick}>
        <div className="dashboard__body-col">{campaign.name}</div>
        <div className="dashboard__body-col">
          {`${keyData.totalFinished}/${keyData.totalAffected}`}
        </div>
        <div className="dashboard__body-col">
          {`${keyData.failureRate}%`}
        </div>
      </div>
    );
  }
}

// ugly workaround to get react-router's history property available for a redirection after click on item
export default withRouter(LatestCreatedCampaignItem);
