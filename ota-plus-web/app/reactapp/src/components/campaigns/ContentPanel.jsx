/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { List, ListHeader } from '.';
import Loader from '../../partials/Loader';

@inject('stores')
@observer
class ContentPanel extends Component {
  static propTypes = {
    stores: PropTypes.object,
    status: PropTypes.string,
    expandedCampaigns: PropTypes.array,
    highlight: PropTypes.string,
    addNewWizard: PropTypes.func,
    showCancelCampaignModal: PropTypes.func,
    showDependenciesModal: PropTypes.func,
    toggleCampaign: PropTypes.func,
  };

  render() {
    const { stores } = this.props;
    const { campaignsStore } = stores;
    const { campaignsFetchAsync } = campaignsStore;
    const { status, highlight, showCancelCampaignModal, showDependenciesModal, expandedCampaigns, toggleCampaign, addNewWizard } = this.props;

    return (
      <div className='campaigns' ref='list'>
        <ListHeader status={status} addNewWizard={addNewWizard} />
        {campaignsFetchAsync[status].isFetching ? (
          <div className='wrapper-center'>
            <Loader />
          </div>
        ) : (
          <List
            status={status}
            focus={highlight}
            expandedCampaigns={expandedCampaigns}
            showCancelCampaignModal={showCancelCampaignModal}
            showDependenciesModal={showDependenciesModal}
            toggleCampaign={toggleCampaign}
          />
        )}
      </div>
    );
  }
}

export default ContentPanel;
