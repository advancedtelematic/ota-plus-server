/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { VelocityTransitionGroup } from 'velocity-react';
import { Statistics, CampaignSummary } from '.';

@observer
class ListItem extends Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    toggleCampaign: PropTypes.func.isRequired,
    isCancelable: PropTypes.bool,
    showCancelCampaignModal: PropTypes.func,
    showDependenciesModal: PropTypes.func,
  };

  toggle = (campaign, mouseEvent) => {
    const { toggleCampaign } = this.props;
    if (mouseEvent) mouseEvent.preventDefault();
    toggleCampaign(campaign);
  };

  render() {
    const { campaign, isExpanded, showDependenciesModal, showCancelCampaignModal, isCancelable, type } = this.props;

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
            <div className='campaigns__item' id={`item-${campaign.id}`} onClick={e => this.toggle(campaign, e)}>
              <div className='wrapper-center'>
                <img src='assets/img/icons/black/arrow-up.svg' alt='Icon'/>
              </div>
            </div>
            <Statistics showCancelCampaignModal={showCancelCampaignModal} showDependenciesModal={showDependenciesModal}
                                    campaignId={campaign.id} hideCancel={!isCancelable}/>
          </div>
        ) : (
          <CampaignSummary campaign={campaign} type={type} toggle={this.toggle}/>
        )}
      </VelocityTransitionGroup>
    );
  }
}

export default ListItem;
