/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { VelocityTransitionGroup } from 'velocity-react';
import Statistics from './Statistics';
import CampaignSummary from './CampaignSummary';

import { assets } from '../../config';

@observer
class ListItem extends Component {
  toggle = (campaign, mouseEvent) => {
    const { toggleCampaign } = this.props;
    if (mouseEvent) mouseEvent.preventDefault();
    toggleCampaign(campaign);
  };

  render() {
    const { campaign, isExpanded, showDependenciesModal,
      showCancelCampaignModal, showRetryModal, isCancelable } = this.props;

    return (
      <VelocityTransitionGroup
        enter={{
          animation: 'slideDown',
        }}
        leave={{
          animation: 'slideUp',
        }}
      >
        {isExpanded ? (
          <div>
            <div className="campaigns__item" id={`item-${campaign.id}`} onClick={e => this.toggle(campaign, e)}>
              <div className="wrapper-center">
                <img src={assets.DEFAULT_COLLAPSE_CAMPAIGN} alt="Icon" />
              </div>
            </div>
            <Statistics
              showCancelCampaignModal={showCancelCampaignModal}
              showDependenciesModal={showDependenciesModal}
              showRetryModal={showRetryModal}
              campaignId={campaign.id}
              hideCancel={!isCancelable}
            />
          </div>
        ) : (
          <CampaignSummary campaign={campaign} toggle={this.toggle} />
        )}
      </VelocityTransitionGroup>
    );
  }
}

ListItem.propTypes = {
  campaign: PropTypes.shape({}).isRequired,
  isCancelable: PropTypes.bool.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  toggleCampaign: PropTypes.func.isRequired,
  showCancelCampaignModal: PropTypes.func.isRequired,
  showDependenciesModal: PropTypes.func.isRequired,
  showRetryModal: PropTypes.func.isRequired,
};

export default ListItem;
