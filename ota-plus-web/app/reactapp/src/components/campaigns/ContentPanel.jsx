/** @format */

import React, { PropTypes, Component } from 'react';
import { observer, inject } from 'mobx-react';
import List from './List';
import Loader from '../../partials/Loader';

@inject('stores')
@observer
export default class ContentPanel extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    expandedCampaigns: PropTypes.object.isRequired,
    highlight: PropTypes.string,
    addNewWizard: PropTypes.func,
    showWizard: PropTypes.func,
    showCancelCampaignModal: PropTypes.func,
    showDependenciesModal: PropTypes.func,
    toggleCampaign: PropTypes.func,
  };

  renderHeader = status => {
    const { addNewWizard } = this.props;
    const headline = {
      prepared: 'In preparation',
      launched: 'running',
      finished: 'finished',
      cancelled: 'canceled',
    };
    const showColumns = status !== 'prepared';

    return (
      <div className='campaigns__header'>
        <div className='campaigns__column'>{headline[status]}</div>
        {showColumns && <div className='campaigns__column'>{'Created at'}</div>}
        {showColumns && <div className='campaigns__column'>{'Processed'}</div>}
        {showColumns && <div className='campaigns__column'>{'Affected'}</div>}
        {showColumns && <div className='campaigns__column'>{'Finished'}</div>}
        {showColumns && <div className='campaigns__column'>{'Failure rate'}</div>}
        <div className='campaigns__header-link'>
          <a
            href='#'
            className='add-button grey-button'
            id='add-new-campaign'
            onClick={e => {
              e.preventDefault();
              addNewWizard();
            }}
          >
            <span>{'+ Add campaign'}</span>
          </a>
        </div>
      </div>
    );
  };

  render() {
    const { campaignsStore } = this.props.stores;
    const { campaignsFetchAsync } = campaignsStore;
    const { status, highlight, showCancelCampaignModal, showDependenciesModal, expandedCampaigns, toggleCampaign } = this.props;

    return (
      <div className='campaigns' ref='list'>
        {this.renderHeader(status)}
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
