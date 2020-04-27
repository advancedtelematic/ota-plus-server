/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import ListItem from './ListItem';
import { contains } from '../../utils/Helpers';
import { CAMPAIGNS_STATUS_LAUNCHED } from '../../config';

@inject('stores')
@observer
class List extends Component {
  static propTypes = {
    stores: PropTypes.shape({}).isRequired,
    status: PropTypes.string.isRequired,
    expandedCampaigns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    showCancelCampaignModal: PropTypes.func.isRequired,
    showDependenciesModal: PropTypes.func.isRequired,
    showRetryModal: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    toggleCampaign: PropTypes.func.isRequired,
  };

  render() {
    const { stores, t } = this.props;
    const { campaignsStore } = stores;
    const { campaigns } = campaignsStore;
    const { status, expandedCampaigns, showCancelCampaignModal,
      showDependenciesModal, showRetryModal, toggleCampaign } = this.props;

    const campaignsAvailable = !!campaigns.length;

    return campaignsAvailable ? (
      <div className="campaigns__list">
        {campaigns.map((campaign) => {
          const isExpanded = contains(expandedCampaigns, campaign);
          const isCancelable = status === CAMPAIGNS_STATUS_LAUNCHED;
          return (
            <ListItem
              key={campaign.id}
              campaign={campaign}
              isExpanded={isExpanded}
              showCancelCampaignModal={showCancelCampaignModal}
              showDependenciesModal={showDependenciesModal}
              showRetryModal={showRetryModal}
              toggleCampaign={toggleCampaign}
              isCancelable={isCancelable}
            />
          );
        })}
      </div>
    ) : (
      <div className="campaigns__list--empty">{t('campaigns.no-campaigns.filtered')}</div>
    );
  }
}

export default withTranslation()(List);
